import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType, SwiperOptions } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { gsap } from 'gsap';
import style from "./styles.module.scss";
import { useGetSizingWindow } from '@/hooks/useGetSizingWindow/useGetSizingWindow';

interface SwiperTextBlockProps {
    title: string,
    textContent: {
        year: number,
        text: string
    }[]
};

const SwiperTextBlock: React.FC<SwiperTextBlockProps> = ({ title, textContent }) => {
    const SwiperRef = useRef<SwiperType | null>(null);
    const [Start, setStart] = useState<boolean>(true);
    const [End, setEnd] = useState<boolean>(true);
    const [WidthWindow] = useGetSizingWindow();
    const containerRef = useRef<HTMLDivElement>(null);
    const paginationRef = useRef<HTMLDivElement>(null);
    const PrevTextContentRef = useRef(textContent);
    const InitialMount = useRef(true);

    const swiperParams: SwiperOptions = {
        modules: [Navigation, Pagination],
        slidesPerView: 1.3,
        navigation: {
            nextEl: '.swiper__custom',
            prevEl: 'swiper__custom_prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet(index, className) {
                return `<span class="${className}" style="background-color: #42567A;"></span>`;
            },
        },
        freeMode: true,
        breakpoints: {
            1400: { slidesPerView: 3 },
            1300: { slidesPerView: 2 },
        }
    };

    useEffect(() => {
        if (window.innerWidth < 500 && WidthWindow < 500) {
            const swiperInstance = SwiperRef.current;
            if (!swiperInstance) return;

            const updateNextSlideStyle = () => {
                document.querySelectorAll('.swiper-slide').forEach(slide => {
                    (slide as HTMLElement).style.opacity = '1';
                });

                const nextSlide = document.querySelector('.swiper-slide-next');
                if (nextSlide) {
                    (nextSlide as HTMLElement).style.opacity = '0.4';
                }
            };

            updateNextSlideStyle();

            swiperInstance.on('slideChange', updateNextSlideStyle);
            swiperInstance.on('transitionEnd', updateNextSlideStyle);

            return () => {
                swiperInstance.off('slideChange', updateNextSlideStyle);
                swiperInstance.off('transitionEnd', updateNextSlideStyle);
            };
        }
        else {
            document.querySelectorAll('.swiper-slide').forEach(slide => {
                (slide as HTMLElement).style.opacity = '1';
            });
        }
    }, [WidthWindow]);

    useEffect(() => {
        if (InitialMount.current) {
            InitialMount.current = false;
            PrevTextContentRef.current = textContent;
            return;
        }

        if (!containerRef.current) return;

        const pagination = paginationRef.current;
        const paginationDisplay = pagination?.style.display;

        gsap.to(containerRef.current, {
            duration: 0.5,
            opacity: 0,
            y: 0,
            ease: "power2.inOut",
            onStart: () => {
                if (pagination) {
                    pagination.style.display = 'none';
                }
            },
            onComplete: () => {
                PrevTextContentRef.current = textContent;
                SwiperRef.current?.update();
                SwiperRef.current?.slideTo(0);

                gsap.fromTo(containerRef.current,
                    { opacity: 0, y: 10 },
                    {
                        duration: 0.5,
                        opacity: 1,
                        y: 0,
                        ease: "power2.inOut",
                        onStart: () => {
                            if (pagination) {
                                pagination.style.display = paginationDisplay || 'block';
                            }
                        }
                    }
                );
            }
        });
    }, [textContent]);

    return (
        <>
            <div className={style.container} ref={containerRef}>
                {WidthWindow < 500 && (<div className={style.title}>{title}</div>)}
                <hr className={style.line} />
                <div className={style.swiper}>
                    <Swiper
                        {...swiperParams}
                        onSwiper={(swiper) => {
                            SwiperRef.current = swiper;
                        }}
                        onSlideChange={(swiper) => {
                            setStart(swiper.isBeginning)
                            setEnd(swiper.isEnd)
                        }}
                        onInit={(swiper) => {
                            setStart(swiper.isBeginning)
                            setEnd(swiper.isEnd)
                        }}
                    >
                        {textContent.map((el, i) => (
                            <SwiperSlide key={i}>
                                <div className={style.swiper__text_block}>
                                    <h3 className={style.text_block__year}>{el.year}</h3>
                                    <p className={style.text_block__text}>{el.text}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button
                        className={style.swiper__custom_prev}
                        onClick={() => SwiperRef.current?.slidePrev()}
                        style={{ display: Start ? 'none' : 'block' }}
                    >
                    </button>

                    <button
                        className={style.swiper__custom}
                        onClick={() => SwiperRef.current?.slideNext()}
                        style={{ display: End ? 'none' : 'block' }}
                    >
                    </button>
                    <div
                        className="swiper-pagination"
                        ref={paginationRef}
                        style={WidthWindow < 500 ? { display: 'block' } : { display: 'none' }}
                    ></div>
                </div>
            </div>
        </>
    );
};

export default SwiperTextBlock;