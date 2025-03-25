import { useCallback, useEffect, useRef } from 'react';
import {
  ColorType,
  createChart,
  CrosshairMode,
  LineStyle,
} from 'lightweight-charts';
import { AreaChartProps } from './props';
import styles from './styles.module.scss';
import { useTranslation } from 'react-i18next';

export function AreaChart({ data, isLoading, currency }: AreaChartProps) {
  const {
    t,
    i18n: { language },
  } = useTranslation('common');
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const documentStyles = getComputedStyle(document.body);
  const primaryColor = documentStyles
    .getPropertyValue('--primary-color')
    .trim();
  const textPrimaryColor = documentStyles
    .getPropertyValue('--text-primary-color')
    .trim();
  const containerColor = documentStyles
    .getPropertyValue('--background-paper-color')
    .trim();

  function convertHexToRGBA(hexCode: string, opacity = 1) {
    let hex = hexCode.replace('#', '');

    if (hex.length === 3) {
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    if (opacity > 1 && opacity <= 100) {
      opacity = opacity / 100;
    }

    return `rgba(${r},${g},${b},${opacity})`;
  }

  const getAverageValue = useCallback(() => {
    if (!data) return 0;

    const sum = data.reduce((acc, item: any) => acc + item.value, 0);
    const average = sum / data.length;
    return average;
  }, [data]);

  useEffect(() => {
    if (typeof window === 'undefined' || !chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current as HTMLElement, {
      handleScale: {
        axisPressedMouseMove: {
          price: false,
        },
      },
      localization: {
        locale: language,
        timeFormatter: (time: number) => {
          return Intl.DateTimeFormat(language, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(new Date(time * 1000));
        },
      },
      rightPriceScale: {
        autoScale: true,
      },
      layout: {
        background: {
          type: ColorType.Solid,
          color: convertHexToRGBA(containerColor),
        },
        textColor: convertHexToRGBA(textPrimaryColor),
      },
      grid: {
        horzLines: {
          visible: false,
        },
        vertLines: {
          visible: false,
        },
      },
      width: chartContainerRef.current?.clientWidth,
      height: 350,
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: convertHexToRGBA(primaryColor),
          style: LineStyle.LargeDashed,
          labelBackgroundColor: convertHexToRGBA(primaryColor),
          labelVisible: true,
        },
        horzLine: {
          color: convertHexToRGBA(primaryColor),
          labelBackgroundColor: convertHexToRGBA(primaryColor),
          labelVisible: true,
        },
      },
      watermark: {
        visible: false,
      },
    });

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
    };

    chart.timeScale().fitContent();
    chart.priceScale('right').applyOptions({
      autoScale: true,
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    });
    const newSeries = chart.addAreaSeries({
      autoscaleInfoProvider: (original: any) => {
        const res = original();
        if (res === null) {
          return res;
        }

        if (res.priceRange.maxValue === 0) {
          res.priceRange.maxValue = 0.1;
        }
        return res;
      },
      topColor: convertHexToRGBA(primaryColor, 0.56),
      bottomColor: convertHexToRGBA(primaryColor, 0.04),
      lineColor: convertHexToRGBA(primaryColor),
      lineWidth: 2,
      priceFormat: {
        type: 'price',
        precision: currency ? 2 : 8,
        minMove: 0.00000001,
      },
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    });
    newSeries.setData(!data ? [] : data);
    newSeries.createPriceLine({
      price: getAverageValue(),
      color: convertHexToRGBA(primaryColor),
      lineWidth: 2,
      lineStyle: 1,
      axisLabelVisible: true,
    });

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, [
    data,
    containerColor,
    currency,
    getAverageValue,
    primaryColor,
    textPrimaryColor,
  ]);

  if (isLoading) {
    return <div className={styles['chart-skeleton']} />;
  }

  return <div ref={chartContainerRef} />;
}
