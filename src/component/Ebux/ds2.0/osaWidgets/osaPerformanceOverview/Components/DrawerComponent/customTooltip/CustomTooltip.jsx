import { useEffect, useRef, useState } from "react";

const CustomTooltip = ({ title, children, placement = "bottom", widthNo=false}) => {
    const [show, setShow] = useState(false);
    const [isTruncated, setIsTruncated] = useState(true);
    const [tooltipDimensions, setTooltipDimensions] = useState({ width: 300, height: 40 });
    const contentRef = useRef(null);
    const tooltipRef = useRef(null);

    // Check if text is truncated
    const checkTruncation = () => {
        if (contentRef.current) {
            const element = contentRef.current;
            const isTruncatedNow = element.scrollWidth > element.clientWidth;
            setIsTruncated(isTruncatedNow);
        }
    };

    useEffect(() => {
        checkTruncation();
        window.addEventListener('resize', checkTruncation);

        return () => {
            window.removeEventListener('resize', checkTruncation);
        };
    }, []);

    const [position, setPosition] = useState({ top: 0, left: 0 });
    const ref = useRef(null);

    const updatePosition = () => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setPosition({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height
            });
        }
    };

    // Measure tooltip dimensions after it renders
    useEffect(() => {
        if (tooltipRef.current && show && isTruncated) {
            const rect = tooltipRef.current.getBoundingClientRect();
            setTooltipDimensions({
                width: rect.width,
                height: rect.height
            });
        }
    }, [show, isTruncated, title]);

    useEffect(() => {
        if (show && isTruncated) {
            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
        }

        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [show, isTruncated]);

    const getTooltipStyle = () => {
        const { width: tooltipWidth, height: tooltipHeight } = tooltipDimensions;
        const headerHeight = 60;
        const offset = 2; // 2px gap

        // Check if near top (under header)
        const isNearTop = position.top < (headerHeight + tooltipHeight + 5);

        if (isNearTop) {
            return {
                top: position.top + position.height + offset,
                left: Math.max(2, Math.min(
                    window.innerWidth - tooltipWidth - 2,
                    position.left + (position.width / 2) - (tooltipWidth / 2)
                )),
                zIndex: 9999
            };
        }

        switch (placement) {
            case "top":
                return {
                    top: position.top - tooltipHeight - offset,
                    left: Math.max(2, Math.min(
                        window.innerWidth - tooltipWidth - 2,
                        position.left + (position.width / 2) - (tooltipWidth / 2)
                    )),
                    zIndex: 9999
                };
            case "bottom":
                return {
                    top: position.top + position.height + offset,
                    left: Math.max(2, Math.min(
                        window.innerWidth - tooltipWidth - 2,
                        position.left + (position.width / 2) - (tooltipWidth / 2)
                    )),
                    zIndex: 9999
                };
            default:
                return {
                    top: position.top + (position.height / 2) - (tooltipHeight / 2),
                    left: position.left + position.width + offset,
                    zIndex: 9999
                };
        }
    };
    // console.log({ isTruncated, show })
    return (
        <div
            ref={ref}
            className={`relative inline-block group ${widthNo == null ? '' :'w-full'}`}
            onMouseEnter={() => {
                checkTruncation();
                if (contentRef.current && contentRef.current.scrollWidth > contentRef.current.clientWidth) {
                    setIsTruncated(true);
                    setShow(true);
                } else {
                    setIsTruncated(false);
                    setShow(false);
                }
            }}

            onMouseLeave={() => setShow(false)}
        >
            <div ref={contentRef} className="w-full truncate">
                {children}
            </div>
            {show && isTruncated && (
                <>
                    {/* Tooltip */}
                    <div
                        ref={tooltipRef}
                        className="fixed !z-[9999] px-1.5 py-0.5 text-sm text-white bg-gray-800 rounded shadow-lg whitespace-normal break-words max-w-md"
                        style={getTooltipStyle()}
                    >
                        {title}
                    </div>

                    {/* Connector line - only for top/bottom placements */}
                    {(placement === "top" || placement === "bottom") && (
                        <div
                            className="fixed z-[9998] w-0.5 h-1 bg-gray-800"
                            style={{
                                top: placement === "top"
                                    ? position.top - 1
                                    : position.top + position.height,
                                left: position.left + (position.width / 2) - 1,
                            }}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default CustomTooltip;