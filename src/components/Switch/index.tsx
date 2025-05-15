import React from 'react';
import style from './styles.module.scss';

interface SwitchProps {
    quantity: number,
    ActiveTimeInterval: number,
    setActiveTimeInterval: (number: number) => void
};

const Switch: React.FC<SwitchProps> = ({quantity, ActiveTimeInterval, setActiveTimeInterval}) => {

    const handleBack = () => {
        if (ActiveTimeInterval > 0){
            setActiveTimeInterval(ActiveTimeInterval - 1);
        }
        else{
            setActiveTimeInterval(quantity - 1);
        };
    };

    const handleNext = () => {
        if (ActiveTimeInterval < (quantity - 1)) {
            setActiveTimeInterval(ActiveTimeInterval + 1);
        }
        else{
            setActiveTimeInterval(0);
        };
    };

    return (
        <>
            <div className={style.switch}>
                <span className={style.switch__quantity}>0{ActiveTimeInterval + 1}/0{quantity}</span>
                <div className={style.switch__box_buttons}>
                    <button className={style.box_buttons__button} onClick={handleBack}></button>
                    <button className={style.box_buttons__button} onClick={handleNext}></button>
                </div>
            </div>
        </>
    );
};

export default Switch;