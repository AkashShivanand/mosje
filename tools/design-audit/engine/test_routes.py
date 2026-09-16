"""The crawl-only blind spot, and the declaration that closes it."""
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import routes as R  # noqa: E402


class DeclaredFor(unittest.TestCase):
    def test_project_and_role_lists_are_unioned(self):
        cfg = {"live": {"declaredRoutes": ["/do-list", "/surveyors"]}}
        role = {"name": "admin", "declaredRoutes": ["/ia-approvals"]}
        self.assertEqual(R.declared_for(cfg, role), ["/do-list", "/surveyors", "/ia-approvals"])

    def test_a_role_declaring_a_project_route_does_not_duplicate_it(self):
        cfg = {"live": {"declaredRoutes": ["/do-list"]}}
        role = {"declaredRoutes": ["/do-list"]}
        self.assertEqual(R.declared_for(cfg, role), ["/do-list"])

    def test_skip_routes_beat_a_declaration(self):
        """Declaring a route must not smuggle back one the project excluded."""
        cfg = {"live": {"declaredRoutes": ["/do-list", "/logout"], "skipRoutes": ["/logout"]}}
        self.assertEqual(R.declared_for(cfg), ["/do-list"])

    def test_paths_are_normalised(self):
        cfg = {"live": {"declaredRoutes": ["do-list", "/surveyors/", "/x?a=1", "/y#z", "", "  "]}}
        self.assertEqual(R.declared_for(cfg), ["/do-list", "/surveyors", "/x", "/y"])

    def test_no_declarations_is_an_empty_list_not_an_error(self):
        self.assertEqual(R.declared_for({}, None), [])


class Merge(unittest.TestCase):
    def test_declared_routes_are_added_to_the_crawl(self):
        routes, origins = R.merge(["/dashboard", "/users"], ["/do-list"])
        self.assertEqual(routes, ["/dashboard", "/users", "/do-list"])
        self.assertEqual(origins["/do-list"], R.DECLARED)
        self.assertEqual(origins["/users"], R.LINKED)

    def test_a_declared_route_the_crawl_also_found_counts_as_linked(self):
        """It IS linked. Declaring it must not misreport the navigation as broken."""
        _, origins = R.merge(["/dashboard"], ["/dashboard"])
        self.assertEqual(origins["/dashboard"], R.LINKED)

    def test_the_landing_route_leads_and_is_not_duplicated(self):
        routes, origins = R.merge(["/users", "/dashboard"], [], landing="/dashboard")
        self.assertEqual(routes[0], "/dashboard")
        self.assertEqual(routes.count("/dashboard"), 1)
        self.assertEqual(origins["/dashboard"], R.LANDING)

    def test_crawl_order_is_preserved(self):
        routes, _ = R.merge(["/z", "/a", "/m"], ["/b"])
        self.assertEqual(routes, ["/z", "/a", "/m", "/b"])


class Carried(unittest.TestCase):
    def test_a_previous_run_s_route_is_added_once_and_marked(self):
        routes, origins = R.merge(["/dashboard"], [])
        added = R.add_carried(routes, origins, ["/old", "/dashboard"])
        self.assertEqual(added, ["/old"])
        self.assertEqual(origins["/old"], R.CARRIED)
        self.assertEqual(origins["/dashboard"], R.LINKED)


class Report(unittest.TestCase):
    def test_a_captured_declared_route_is_reported_as_unlinked(self):
        """The finding this module exists for: it works, and nothing links to it."""
        routes, origins = R.merge(["/dashboard"], ["/do-list"])
        rep = R.report(origins, ["/dashboard", "/do-list"], ["/do-list"])
        self.assertEqual(rep["unlinked"], ["/do-list"])
        self.assertEqual(rep["unreachable"], [])
        self.assertEqual(rep["gate"], "PASS")

    def test_a_declared_route_that_captured_nothing_fails(self):
        routes, origins = R.merge(["/dashboard"], ["/ghost"])
        rep = R.report(origins, ["/dashboard"], ["/ghost"])
        self.assertEqual(rep["unreachable"], ["/ghost"])
        self.assertEqual(rep["gate"], "FAIL")

    def test_a_linked_route_is_never_reported_as_unlinked(self):
        routes, origins = R.merge(["/dashboard"], ["/dashboard"])
        rep = R.report(origins, ["/dashboard"], ["/dashboard"])
        self.assertEqual(rep["unlinked"], [])
        self.assertEqual(rep["linked"], ["/dashboard"])

    def test_declaring_nothing_passes_and_claims_nothing(self):
        """A project with no declarations must not look like a project with full coverage."""
        routes, origins = R.merge(["/dashboard"], [])
        rep = R.report(origins, ["/dashboard"], [])
        self.assertEqual(rep["gate"], "PASS")
        self.assertEqual(rep["counts"]["declared"], 0)
        self.assertEqual(rep["unlinked"], [])

    def test_the_smile_miss_would_now_be_caught(self):
        """The three screens a link-crawl could not see, declared and probed."""
        crawled = ["/dashboard", "/users", "/persons", "/shelter-homes"]
        declared = ["/do-list", "/ia-approvals", "/shelter-homes/checklist", "/surveyors"]
        routes, origins = R.merge(crawled, declared)
        # all four are probed, none of them linked
        self.assertTrue(set(declared).issubset(set(routes)))
        rep = R.report(origins, crawled + declared, declared)
        self.assertEqual(rep["unlinked"], sorted(declared))
        self.assertEqual(rep["gate"], "PASS")
        self.assertIn("declared route", R.summarise(rep))

    def test_summarise_is_silent_when_there_is_nothing_to_say(self):
        routes, origins = R.merge(["/dashboard"], [])
        self.assertEqual(R.summarise(R.report(origins, ["/dashboard"], [])), "")

    def test_summarise_names_an_unreachable_declaration_loudly(self):
        routes, origins = R.merge(["/dashboard"], ["/ghost"])
        line = R.summarise(R.report(origins, ["/dashboard"], ["/ghost"]))
        self.assertIn("captured NOTHING", line)
        self.assertIn("/ghost", line)


if __name__ == "__main__":
    unittest.main()


class ForeignOriginIsNeverARoute(unittest.TestCase):
    """PM-AJAY, 2026-09-12: the signin crawl produced the route

        /https://seniorcitizen-admin.dosje.gov.in/login

    an absolute URL to ANOTHER MoSJE portal with a slash prepended by `_clean` itself. It was
    fetched as `https://pmajay-dev.mosje.in/https://seniorcitizen-admin.dosje.gov.in/login`,
    returned a 404 page, and the coverage ledger counted that 404 as an audited PM-AJAY screen.
    A run that miscounts its own coverage cannot be trusted about what it covered.
    """

    def test_an_absolute_url_is_dropped_not_prefixed(self):
        for foreign in ("https://seniorcitizen-admin.dosje.gov.in/login",
                        "http://example.gov.in/x",
                        "//cdn.example.com/a",
                        "mailto:someone@gov.in",
                        "tel:+911234567890",
                        "javascript:void(0)",
                        "data:text/html,x"):
            with self.subTest(href=foreign):
                self.assertEqual(R._clean([foreign]), [])

    def test_the_already_mangled_form_is_also_dropped(self):
        # the exact string that reached the browser
        self.assertEqual(R._clean(["/https://seniorcitizen-admin.dosje.gov.in/login"]), [])

    def test_ordinary_paths_are_untouched(self):
        self.assertEqual(R._clean(["/admin/dashboard", "gia/reports", "/x/"]),
                         ["/admin/dashboard", "/gia/reports", "/x"])

    def test_a_path_that_merely_contains_a_colon_still_works(self):
        # a router param is a legitimate path segment
        self.assertEqual(R._clean(["/admin/gia/pending-list/:aap_id"]),
                         ["/admin/gia/pending-list/:aap_id"])

    def test_a_declared_foreign_route_cannot_reach_the_report_either(self):
        cfg = {"live": {"declaredRoutes": ["/admin/dashboard",
                                           "https://other-portal.gov.in/login"]}}
        self.assertEqual(R.declared_for(cfg), ["/admin/dashboard"])
