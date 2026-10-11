import { motion, useReducedMotion } from 'framer-motion'

// Section headings rise out of a mask line by line, the same move as the hero name.
export default function SectionTitle({ id, lines, className = '' }) {
  const reduce = useReducedMotion()

  return (
    <h2 id={id} className={`h-section ${className}`}>
      {lines.map((line, i) => (
        <span key={line} className="line-mask">
          <motion.span
            className="block"
            initial={reduce ? false : { y: '108%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h2>
  )
}
