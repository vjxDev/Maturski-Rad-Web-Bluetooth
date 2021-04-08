export const NavHeat = () => {
  return (
    <div className="w-full h-full sm:flex sm:flex-row text-center justify-around hover:bg-gray-200">
      <div className="pt-2 sm:pt-0 flex flex-col justify-center h-full">
        <svg className="h-6 w-6 mx-auto" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z"
          />
        </svg>
        <span>Temperature</span>
      </div>
      {/* <div className="hidden invisible sm:flex flex-col sm:visible self-center  ">
        <span>20 C</span>
        <span>69%</span>
      </div> */}
    </div>
  );
};
