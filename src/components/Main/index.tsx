import Circle from '../Circle';
import Switch from '../Switch';
import style from './styles.module.scss';
import { ArrayTimeIntervals } from './ArrayTimeIntervals';
import { useSessionStorage } from '@/hooks/useSessionStorage/useSessionStorage';
import SwiperTextBlock from '../Swiper';
import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

const Main = () => {
    const [ActiveTimeInterval, setActiveTimeInterval] = useSessionStorage('active-points', ArrayTimeIntervals.length - 1);
    const [DelayAppereance, setDelayAppereance] = useState(false);
    const prevYearsRef = useRef<string[]>(ArrayTimeIntervals[ActiveTimeInterval].years);
    const fromYearRef = useRef<HTMLSpanElement>(null);
    const toYearRef = useRef<HTMLSpanElement>(null);

    const animateYearChange = (from: string, to: string, element: HTMLElement, duration: number = 1) => {
        const fromNum = parseInt(from);
        const toNum = parseInt(to);
        const obj = { value: fromNum };
        
        gsap.to(obj, {
            value: toNum,
            duration: duration,
            ease: "power2.out",
            onUpdate: () => {
                element.textContent = Math.floor(obj.value).toString();
            }
        });
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDelayAppereance(true);
        }, 500);

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (!fromYearRef.current || !toYearRef.current) return;

        const currentYears = ArrayTimeIntervals[ActiveTimeInterval].years;
        const [prevFrom, prevTo] = prevYearsRef.current;
        const [currentFrom, currentTo] = currentYears;

        const prevFromNum = parseInt(prevFrom);
        const prevToNum = parseInt(prevTo);
        const currentFromNum = parseInt(currentFrom);
        const currentToNum = parseInt(currentTo);

        const fromDuration = Math.abs(currentFromNum - prevFromNum) * 0.1;
        const toDuration = Math.abs(currentToNum - prevToNum) * 0.1;

        animateYearChange(prevFrom, currentFrom, fromYearRef.current, Math.max(0.5, Math.min(fromDuration, 1.5)));
        
        animateYearChange(prevTo, currentTo, toYearRef.current, Math.max(0.5, Math.min(toDuration, 1.5)));

        prevYearsRef.current = currentYears;

    }, [ActiveTimeInterval]);

    return (
        <>
            <main className={style.main} style={DelayAppereance ? {opacity: 1} : {opacity: 0}}>
                <h1 className={style.main__header}>Исторические даты</h1>
                <h2 className={style.main__years}>
                    <span ref={fromYearRef} className={style.years__from}>
                        {ArrayTimeIntervals[ActiveTimeInterval].years[0]}
                    </span>
                    <span ref={toYearRef} className={style.years__to}>
                        {ArrayTimeIntervals[ActiveTimeInterval].years[1]}
                    </span>
                </h2>
                <Circle 
                    title={ArrayTimeIntervals[ActiveTimeInterval].title} 
                    quantity={ArrayTimeIntervals.length} 
                    ActiveTimeInterval={ActiveTimeInterval} 
                    setActiveTimeInterval={setActiveTimeInterval} 
                />
                <Switch quantity={ArrayTimeIntervals.length} ActiveTimeInterval={ActiveTimeInterval} setActiveTimeInterval={setActiveTimeInterval} />
                <SwiperTextBlock title={ArrayTimeIntervals[ActiveTimeInterval].title} textContent={ArrayTimeIntervals[ActiveTimeInterval].content} />
            </main>
        </>
    );
};

export default Main;