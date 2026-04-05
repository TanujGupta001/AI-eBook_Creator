import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import axiosInstance from "./../utils/axiosInstance";
import { API_PATHS } from "./../utils/apiPaths";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Book } from "lucide-react";
import Viewbook from "../components/view/Viewbook";

const ViewBookSkeleton = () => (
  <div className="animate-pulse">
    <div className="w-1/2 h-8 bg-slate-200 rounded mb-4" />
    <div className="w-1/2 h-8 bg-slate-200 rounded mb-4" />

    <div className="flex items-center gap-8">
      <div className="w-1/4">
        <div className="h-96 bg-slate-200 rounded-lg" />
      </div>

      <div className="w-3/4">
        <div className="h-full bg-slate-200 rounded-lg" />
      </div>
    </div>
  </div>
);

const ViewBookPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch book on mount
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await axiosInstance.get(
          `${API_PATHS.BOOKS.GET_BOOK_BY_ID}/${bookId}`
        );
        setBook(data.book);
      } catch (error) {
        console.error("Error fetching book:", error);
        toast.error("Failed to fetch book details!", { duration: 5000 });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [bookId, navigate]);

  return (
    <DashboardLayout>
      {isLoading ? (
        <div className="container max-w-7xl p-4 md:p-6 mx-auto">
          <ViewBookSkeleton />
        </div>
      ) : book ? (
        <Viewbook book={book} />
      ) : (
        <div className="h-full px-4 flex justify-center items-center">
          <section className="text-center border-2 border-dashed border-slate-200 rounded-xl px-4 py-12">
            <div className="size-16 bg-slate-100 rounded-full mb-4 mx-auto flex justify-center items-center">
              <Book className="size-8 text-slate-400" />
            </div>

            <h3 className="text-slate-900 text-lg font-medium mb-2">
              eBook Not Found
            </h3>

            <p className="max-w-md text-slate-500 text-sm mb-6">
              The eBook you are looking for either does not exist or you do not
              have permission to view it.
            </p>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ViewBookPage
