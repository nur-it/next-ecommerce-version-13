import { useState } from 'react';
import Switch from 'react-switch';

const SwitchToggle = ({ att, handleChangeVariant }) => {
  const [enable, setEnabled] = useState(att ? true : false);
  const handleEnabled = (checked, e, id) => {
    console.log(checked, e, id);
   // handleChangeVariant(e, !enable);
    setEnabled(!enable);
  };
  return (
    <>
      <div className={`${'mb-3 flex flex-wrap  items-center mr-3'}`}>
        <div className="flex flex-wrap items-center">
          <Switch
            onChange={() => handleEnabled(enable, att, att)}
            checked={enable}
            className="react-switch"
            uncheckedIcon={
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  fontSize: 16,
                  color: 'white',
                  paddingRight: 10,
                  paddingTop: 1,
                }}
              >
                No
              </span>
            }
            width={65}
            height={26}
            handleDiameter={20}
            offColor="#E53E3E"
            onColor="#2F855A"
            checkedIcon={
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  fontSize: 16,
                  color: 'white',
                  paddingRight: 20,
                  paddingTop: 1,
                }}
              >
                Yes
              </span>
            }
          />
        </div>
      </div>
    </>
  );
};

export default SwitchToggle;
