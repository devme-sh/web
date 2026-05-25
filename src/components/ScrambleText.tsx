import { useScramble } from 'use-scramble'

export function ScrambleText({
  text,
  className,
  as: Tag = 'span',
  speed = 0.8,
  tick = 1,
  step = 1,
  scramble = 4,
  seed = 0,
}: {
  text: string
  className?: string
  as?: keyof JSX.IntrinsicElements
  speed?: number
  tick?: number
  step?: number
  scramble?: number
  seed?: number
}) {
  const { ref } = useScramble({
    text,
    speed,
    tick,
    step,
    scramble,
    seed,
    overdrive: false,
  })

  return <Tag ref={ref as any} className={className} />
}
