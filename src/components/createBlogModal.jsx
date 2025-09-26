import Modal from "./modal";

export default function CreateBlogModal({ isOpen, onClose }) {

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[90vw] max-w-3xl min-h-[60vh] p-6">
        <h2 className="text-xl font-semibold mb-4">Create New Blog Post</h2>
        {/* Form fields for blog post creation */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter blog post title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              className="w-full border border-gray-300 rounded-md p-2 h-40"
              placeholder="Write your blog post content here..."
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-[var(--color-secondary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-md bg-[var(--color-primary)]"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}