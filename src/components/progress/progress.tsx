import { useNProgress } from '@tanem/react-nprogress';
import React from 'react';

type ProgressProps = {
  isAnimating: boolean;
};

const Progress: React.FC<ProgressProps> = ({ isAnimating }) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  });

  return (
    <Container animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
    </Container>
  );
};

export default Progress;

type ContainerProps = {
  animationDuration: number;
  children: React.ReactNode;
  isFinished: boolean;
};

const Container: React.FC<ContainerProps> = ({
  animationDuration,
  children,
  isFinished,
}) => {
  return (
    <div
      className="pointer-events-none"
      style={{
        opacity: isFinished ? 0 : 1,
        transition: `opacity ${animationDuration}ms linear`,
      }}
    >
      {children}
    </div>
  );
};

type BarProps = {
  animationDuration: number;
  progress: number;
};

const Bar: React.FC<BarProps> = ({ animationDuration, progress }) => {
  return (
    <div
      className="fixed left-0 top-0 z-[9999] h-1 w-full bg-red-500"
      style={{
        marginLeft: `${(-1 + progress) * 100}%`,
        transition: `margin-left ${animationDuration}ms linear`,
      }}
    />
  );
};
