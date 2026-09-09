import { AssistantChat } from "./AssistantChat";

/** The assistant option on a blank page, so the chat window is the whole picture. */
export default function AssistantPrototype() {
  return (
    <main id="main-content" style={{ minHeight: "100vh" }}>
      <AssistantChat />
    </main>
  );
}
