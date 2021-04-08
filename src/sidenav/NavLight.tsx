export const NavLight = () => {
  return (
    <div className="w-full h-full text-center pt-2 sm:pt-0 flex flex-col justify-center hover:bg-gray-200">
      <svg className="h-6 w-6 mx-auto" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z"
        />
      </svg>
      <span>Light</span>
    </div>
  );
};
