import { Plus } from "lucide-react";
import Header from "./Header";
import PostModal from "./PostModal";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="mx-auto max-w-7xl p-4 sm:p-8">{children}</div>
      </main>
      <div className="fab">
        <button
          className="btn btn-accent btn-circle"
          onClick={() => document.getElementById("modal-post").showModal()}
        >
          <Plus />
        </button>
      </div>
      <PostModal />
    </>
  );
}
