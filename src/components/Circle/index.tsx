import React, { useEffect, useRef, useState } from 'react';
import style from './styles.module.scss';
import { useGetSizingWindow } from '@/hooks/useGetSizingWindow/useGetSizingWindow';

interface CircleProps {
    title?: string,
    quantity: number,
    ActiveTimeInterval: number,
    setActiveTimeInterval: (number: number) => void
};

type PointsTipe = {
    r: number,
    x: number,
    y: number,
    activeIndex: null | number
}[];

const Circle: React.FC<CircleProps> = ({ title, quantity, ActiveTimeInterval, setActiveTimeInterval }) => {

    const CircleRef = useRef<null | HTMLDivElement>(null);
    const [Points, setPoints] = useState<PointsTipe | []>([]);
    const [rotationAngle, setRotationAngle] = useState(0);
    const [WidthWindow] = useGetSizingWindow();

    const handlePositioningPoints = (n: number, r: number) => {
        setPoints([]);
        if (!CircleRef.current) return;

        const R = (CircleRef.current?.offsetWidth) / 2;

        for (let i = 0; i < n; i++) {
            const angle = (2 * Math.PI * i) / n;
            const X = R + R * Math.cos(angle);
            const Y = R + R * Math.sin(angle);

            setPoints((prevState) => {
                const newPrevState = [...prevState];
                newPrevState.push({ r: r, x: X - r, y: Y - r, activeIndex: i === n - 1 ? n - 1 : null });
                return newPrevState;
            });
        };
    };

    const handleChooseActive = (index: number) => {
        const targetIndex = Points.length - 1;
        const angleStep = (2 * Math.PI) / Points.length;
        const targetAngle = (targetIndex - index) * angleStep;

        setPoints(prev => prev.map((el, i) => ({
            ...el,
            activeIndex: i === index ? index : null
        })));

        setRotationAngle(targetAngle);
        setActiveTimeInterval(index);
    };

    useEffect(() => {
        handlePositioningPoints(6, quantity);
    }, [CircleRef.current, WidthWindow]);

    useEffect(() => {
        handleChooseActive(ActiveTimeInterval);
    }, [ActiveTimeInterval]);

    return (
        <>
            <div className={style.circle} ref={CircleRef} style={{ transform: `translate(-50%, -50%) rotate(${rotationAngle}rad)`, transition: 'transform 1s ease-in-out' }}>
                {Points.map((el, i) => {
                    return (
                        <div
                            className={el.activeIndex === i ? `${style.circle__points} ${style.circle__points_active}` : `${style.circle__points}`}
                            key={i}
                            data-index={`${i + 1}`}
                            data-title={`${el.activeIndex === i ? title : null}`}
                            style={{ "--radius": `${el.r}px`, left: `${el.x}px`, top: `${el.y}px`, transform: `rotate(${-rotationAngle}rad)` } as React.CSSProperties}
                            onClick={() => handleChooseActive(i)}
                        >
                        </div>
                    )
                })}
            </div>
        </>
    );
};

export default Circle;