import { animate, motion, useMotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function ScoreCounter({ score = 0 }) {
  const prevScoreRef = useRef(score);
  const [baseDisplay, setBaseDisplay] = useState(score);
  const [bonusDisplay, setBonusDisplay] = useState(0);

  const base = useMotionValue(score);
  const bonus = useMotionValue(0);

  useEffect(() => {
    const prevScore = prevScoreRef.current;

    if (score === prevScore) return;

    const added = score - prevScore;
    prevScoreRef.current = score;

    // Reset motion values instantly so animation restarts cleanly
    base.set(prevScore);
    bonus.set(added);
    setBaseDisplay(prevScore);
    setBonusDisplay(added);

    const baseControls = animate(base, score, {
      duration: 1,
      delay: 1,
      ease: 'easeOut',
      onUpdate: (v) => setBaseDisplay(Math.round(v)),
    });

    const bonusControls = animate(bonus, 0, {
      duration: 1,
      delay: 1,
      ease: 'easeOut',
      onUpdate: (v) => setBonusDisplay(Math.round(v)),
    });

    return () => {
      baseControls.stop();
      bonusControls.stop();
    };
  }, [score]);

  return (
    <div className='inline'>
      <motion.span>{baseDisplay}</motion.span>
      {bonusDisplay !== 0 && (
        <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
          +{bonusDisplay}
        </motion.span>
      )}
    </div>
  );
}
