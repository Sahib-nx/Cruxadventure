{/* Top badges */}
<div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
  <span className="glass text-xs font-body font-medium text-white/80 px-3 py-1 rounded-full border border-white/10">
    {destination.country === 'India' ? 'Kashmir' : destination.country}
  </span>
  <div className="flex flex-wrap gap-1 justify-end max-w-[55%]">
    {destination.bestSeason.map((season) => (
      <span
        key={season}
        className="bg-gold-500/90 text-navy-900 text-[10px] font-body font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
      >
        {season}
      </span>
    ))}
  </div>
</div>