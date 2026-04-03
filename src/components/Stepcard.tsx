interface Step {
  title: string
  description: string
  icon: JSX.Element
  number: number
}

const StepCard = ({ step }: { step: Step }) => (
  <div className="relative p-8 rounded-xl bg-white/5 border border-white/10 hover:border-custom-accent/30 transition-colors group">
    <div className="flex items-center gap-4 mb-5">
      <div className="w-12 h-12 rounded-full bg-custom-accent/10 border border-custom-accent/30 flex items-center justify-center text-white group-hover:bg-custom-accent/20 transition-colors">
        {step.icon}
      </div>
      <span className="text-xs font-body tracking-widest uppercase text-custom-light/40">
        Step {step.number}
      </span>
    </div>
    <h3 className="text-xl font-heading font-semibold mb-3">{step.title}</h3>
    <p className="text-base text-custom-light/60 font-body font-light leading-relaxed">
      {step.description}
    </p>
  </div>
)

export default StepCard