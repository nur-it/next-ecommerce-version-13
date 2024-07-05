const Tags = ({ tags }) => {
  return (
    <>
      <div className="flex flex-row cursor-pointer mt-1 ml-1">
        {tags?.map((t, i) => (
          <span
            key={i + 1}
            className="bg-gray-100 hover:bg-gray-300 mr-2 border-0 text-gray-600 rounded-full inline-flex items-center justify-center px-3 py-1 text-xs font-medium font-serif"
          >
            {t}
          </span>
        ))}
      </div>
    </>
  );
};

export default Tags;
