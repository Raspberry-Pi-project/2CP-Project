// components/RadarChart.js - Updated container width
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import { colors } from '../constants/colors';

const { width } = Dimensions.get('window');
// Keep the SVG dimensions proportional but expand the container
const size = width * 0.9;
const cx = size / 2;
const cy = size / 2;
const radius = size * 0.35;

const RadarChart = ({ 
  data = [
    { axis: "Math", value: 28 },
    { axis: "Physics", value: 21 },
    { axis: "English", value: 32 },
    { axis: "Science", value: 25 }
  ],
  maxValue = 35,
  fillColor = "rgba(164, 47, 193, 0.4)",
  strokeColor = "rgba(164, 47, 193, 0.8)",
  strokeWidth = 2,
  axisColor = "#999",
  gridColor = "#ccc",
  textColor = "#333"
}) => {
  const total = data.length;
  
  // Calculate angles and coordinates
  const angleSlice = (Math.PI * 2) / total;
  
  // Calculate coordinates for grid circles
  const gridCircles = [0.2, 0.4, 0.6, 0.8, 1].map(factor => {
    const r = radius * factor;
    return { r };
  });
  
  // Calculate coordinates for axis lines
  const getAxisCoordinate = (i) => {
    const angle = i * angleSlice;
    return {
      x: cx + radius * Math.cos(angle - Math.PI / 2),
      y: cy + radius * Math.sin(angle - Math.PI / 2),
    };
  };
  
  // Calculate axis points
  const axisPoints = Array.from({ length: total }, (_, i) => getAxisCoordinate(i));
  
  // Calculate radar points based on data values
  const radarPoints = data.map((d, i) => {
    const angle = i * angleSlice;
    const r = (d.value / maxValue) * radius;
    return {
      x: cx + r * Math.cos(angle - Math.PI / 2),
      y: cy + r * Math.sin(angle - Math.PI / 2),
    };
  });
  
  // Format polygon points for SVG
  const polygonPoints = radarPoints.map(p => `${p.x},${p.y}`).join(' ');
  
  // Calculate axis label positions
  const axisLabels = data.map((d, i) => {
    const angle = i * angleSlice;
    const labelRadius = radius * 1.3;
    return {
      x: cx + labelRadius * Math.cos(angle - Math.PI / 2),
      y: cy + labelRadius * Math.sin(angle - Math.PI / 2),
      label: d.axis,
      angle: angle * (180 / Math.PI),
    };
  });
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Academic Mastery</Text>
      <Svg width={size} height={size} style={styles.chart}>
        {/* Grid circles */}
        {gridCircles.map((circle, i) => (
          <Circle
            key={`grid-circle-${i}`}
            cx={cx}
            cy={cy}
            r={circle.r}
            stroke={gridColor}
            strokeWidth={0.5}
            fill="none"
          />
        ))}
        
        {/* Axis lines */}
        {axisPoints.map((point, i) => (
          <Line
            key={`axis-line-${i}`}
            x1={cx}
            y1={cy}
            x2={point.x}
            y2={point.y}
            stroke={axisColor}
            strokeWidth={1}
          />
        ))}
        
        {/* Grid values */}
        <SvgText
          x={cx + 10}
          y={cy}
          fontSize="10"
          fill={textColor}
        >
          0
        </SvgText>
        <SvgText
          x={cx + radius * 0.2 + 10}
          y={cy}
          fontSize="10"
          fill={textColor}
        >
          5
        </SvgText>
        <SvgText
          x={cx + radius * 0.4 + 10}
          y={cy}
          fontSize="10"
          fill={textColor}
        >
          10
        </SvgText>
        <SvgText
          x={cx + radius * 0.6 + 10}
          y={cy}
          fontSize="10"
          fill={textColor}
        >
          15
        </SvgText>
        <SvgText
          x={cx + radius * 0.8 + 10}
          y={cy}
          fontSize="10"
          fill={textColor}
        >
          20
        </SvgText>
        <SvgText
          x={cx + radius + 10}
          y={cy}
          fontSize="10"
          fill={textColor}
        >
          25
        </SvgText>
        
        {/* Radar data polygon */}
        <Polygon
          points={polygonPoints}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Axis labels */}
        {axisLabels.map((item, i) => {
          const anchor = 
            item.angle === 0 ? 'start' :
            item.angle === 180 ? 'end' :
            item.angle === 90 ? 'middle' :
            item.angle === 270 ? 'middle' :
            item.angle > 0 && item.angle < 180 ? 'start' : 'end';
          
          const alignmentBaseline = 
            item.angle === 90 ? 'hanging' :
            item.angle === 270 ? 'baseline' :
            'middle';
            
          return (
            <SvgText
              key={`axis-label-${i}`}
              x={item.x}
              y={item.y}
              textAnchor={anchor}
              alignmentBaseline={alignmentBaseline}
              fontSize="14"
              fontWeight="bold"
              fill={textColor}
            >
              {item.label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%', // Ensure container takes full width
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.text,
  },
  chart: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default RadarChart;