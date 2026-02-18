import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Book } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import BookCard from "../components/cards/BookCard";
import CreateBookModal from "../components/modals/CreateBookModal";

// Skeleton loader for book card
const BookCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm animate-pulse">
    <div className="w-full aspect-16/25 bg-gray-200 rounded-t-xl" />

    <div className="p-4">
      <div className="w-3/4 h-5 md:h-6 bg-gray-200 rounded mb-2" />
      <div className="w-1/2 h-3 md:h-4 bg-gray-200 rounded" />
    </div>
  </div>
);

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isDeleting,
}) => {
  // Escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, isDeleting]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="min-h-screen px-4 flex justify-center items-center">
        {/* Backdrop */}
        <div
          onClick={onClose}
          className="bg-black/50 backdrop-blur-sm fixed inset-0 animate-in fade-in duration-200"
          aria-hidden="true"
        />

        {/* Modal */}
        <div className="max-w-md w-full bg-white rounded-xl p-5 md:p-6 shadow-xl relative animate-in zoom-in-95 duration-200">
          <h3
            id="delete-modal-title"
            className="text-gray-900 text-base md:text-lg font-semibold mb-3 md:mb-4 pr-4 wrap-break-word"
          >
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-600 text-sm md:text-base mb-5 md:mb-6">
            {message}
          </p>

          {/* Action buttons */}
          <div className="flex justify-end items-center gap-x-2 md:gap-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={onConfirm}
              isLoading={isDeleting}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(API_PATHS.BOOKS.GET_BOOKS);
        setBooks(response.data);
      } catch (error) {
        toast.error("Failed to fetch your eBooks.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);
  const handleDeleteBook = async () => {
    if (!bookToDelete) return;

    setIsDeleting(true);

    try {
      await axiosInstance.delete(
        `${API_PATHS.BOOKS.DELETE_BOOK}/${bookToDelete}`,
      );

      setBooks((prev) => prev.filter((b) => b._id !== bookToDelete));
      toast.success("Book removed successfully!");
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to remove book!");
    } finally {
      setIsDeleting(false);
      setBookToDelete(null);
    }
  };

  const handleCreateBookClick = (bookId) => {
    setIsCreateModalOpen(true);
    
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-lg font-bold text-slate-900">All eBooks</h1>
            <p className="text-[13px] text-slate-600 mt-1">
              Create, edit, and manage all your AI-generated eBooks.
            </p>
          </div>
          <Button
            className="whitespace-nowrap"
            onClick={handleCreateBookClick}
            icon={Plus}
          >
            Create New eBook
          </Button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-xl mt-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Book className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 -mb-2">
              No eBooks Found
            </h3>
            <p className="text-slate-500 mb-6 max-w-md">
              You haven't created any eBooks yet. Get started by creating your
              first one.
            </p>
            <Button onClick={handleCreateBookClick} icon={Plus}>
              Create Your First eBooks
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onDelete={() => setBookToDelete(book._id)}
              />
            ))}
          </div>
        )}

        {/* Delete confirmation modal */}
        <DeleteConfirmationModal
          isOpen={!!bookToDelete}
          onClose={() => !isDeleting && setBookToDelete(null)}
          onConfirm={handleDeleteBook}
          isDeleting={isDeleting}
          title={`Remove "${
            books.find((b) => b?._id === bookToDelete)?.title || "this book"
          }"?`}
          message="This action is permanent and cannot be undone. All chapters and content will be lost."
        />

        {/* Create book modal */}
        <CreateBookModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onBookCreate={handleCreateBookClick}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
