import Switch from 'react-switch';

const SwitchToggleShippingAdd = ({ setExistingShipping, existingShipping }) => {
  return (
    <>
      <div
        className={`${'mb-3 flex flex-wrap  items-center mr-3 justify-end'}`}
      >
        <div className="flex flex-wrap items-center">
          <Switch
            onChange={() => setExistingShipping(!existingShipping)}
            checked={existingShipping}
            className="react-switch"
            uncheckedIcon={
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'left',
                  alignItems: 'left',
                  height: '100%',
                  fontSize: 14,
                  color: 'white',
                  paddingRight: 25,
                  paddingTop: 10,
                }}
              >
                Use Existing Address
              </span>
            }
            width={215}
            height={40}
            handleDiameter={30}
            offColor="#10b981"
            onColor="#2F855A"
            checkedIcon={
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  width: '100%',
                  fontSize: 14,
                  color: 'white',
                  paddingRight: 60,
                  paddingLeft:25,
                  paddingTop: 1,
                }}
              >
                Ship to New Address
              </span>
            }
          />
        </div>
      </div>
    </>
  );
};

export default SwitchToggleShippingAdd;
