import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col w-full items-center gap-2">
        <div>Home</div>
        <button
          className=" border rounded-lg p-1 text-white bg-blue-600 hover:bg-blue-700 transition hover:cursor-pointer"
          onClick={() => navigate('/signin')}
        >
          sign In
        </button>
        <button
          className=" border rounded-lg p-1 text-white bg-green-600 hover:bg-green-700 transition hover:cursor-pointer"
          onClick={() => navigate('/signup')}
        >
          sign Up
        </button>
      </div>
    </>
  );
};

export default Home;
