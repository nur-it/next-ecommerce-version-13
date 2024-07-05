const IndexLoading = ({ loadingIndex }) => {
  return (
    <div
      className=" flex h-screen py-9 w-full text-lg text-center"
      style={{ backgroundColor: '#10527F', height: '100vh' }}
    >
      <span className="w-full  py-4 inline-block align-middle content-center m-auto">
        <div className="fade-in">
          <img
            width="350px"
            height="235px"
            src={'/loading.png'}
            alt={`Loading`}
            className="items-center text-center m-auto fade-in-image "
          />
        </div>

        <div className="text-center pt-8 method-1">
          <p data-text="Opening your shop. Just a sec..." className="method-1">
            Opening your shop. Just a sec...
          </p>
        </div>
      </span>

      <br />
    </div>
  );
};

export default IndexLoading;