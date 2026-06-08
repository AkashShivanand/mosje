// PreToolUse(Bash) safety guard for the MoSJE workspace.
// Reads the hook payload on stdin; exit 2 = BLOCK the tool call, exit 0 = allow.
// Born from a real incident: `rm -rf` on a case-folded dir wiped an app. Never again.

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let cmd = "";
  let tool = "";
  try {
    const j = JSON.parse(raw || "{}");
    tool = j.tool_name || "";
    cmd = (j.tool_input && j.tool_input.command) || "";
  } catch {
    process.exit(0); // can't parse → don't get in the way
  }
  if (tool !== "Bash" || !cmd) process.exit(0);

  // [pattern, human reason] — first match blocks.
  const RULES = [
    [/\brm\s+(-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r|-r\b|--recursive)/i,
      "recursive delete (rm -r / rm -rf). Deletes are irreversible and bypass the Trash. Delete manually if truly intended."],
    [/\bgit\s+push\b[^\n]*?(--force(?!-with-lease)|\s-f\b)/i,
      "git push --force. Use --force-with-lease and run it yourself."],
    [/\bgit\s+clean\s+-[a-z]*f/i,
      "git clean -f deletes untracked files. Review and run manually."],
    [/\bgit\s+reset\s+--hard\b/i,
      "git reset --hard discards working-tree changes. Confirm and run manually."],
    [/\bfind\b[^\n]*\s-delete\b/i,
      "find ... -delete performs bulk deletion."],
    [/(^|\s)dd\s+[^\n]*of=/i,
      "dd with of= can destroy disks/files."],
    [/(^|[^>])>\s*\/dev\/(disk|sd|rdisk)/i,
      "redirect into a raw disk device."],
    [/\b(cat|less|more|head|tail|cp|mv|grep|rg)\b[^\n]*\.env(\.[a-z]+)?(\s|$|['\"])/i,
      "touching a .env file (secrets). Off-limits to automated tools."],
    [/:\(\)\s*\{\s*:\|:&\s*\}\s*;:/,
      "fork bomb."],
  ];

  for (const [re, reason] of RULES) {
    if (re.test(cmd)) {
      process.stderr.write(
        `🛑 BLOCKED by .claude/hooks/guard.sh\n` +
        `Reason: ${reason}\n` +
        `Command: ${cmd}\n` +
        `If this is genuinely needed, run it deliberately in your own terminal.\n`
      );
      process.exit(2); // block
    }
  }
  process.exit(0); // allow
});
