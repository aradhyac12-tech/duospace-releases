import { motion } from "framer-motion";
import { revealViewport } from "../lib/motion";

const REMOVED = ["Followers", "Likes", "Comments", "Public posts", "Group feeds", "Ads"];

export function BrandStory() {
  return (
    <>
      <section className="relative px-5 py-28 md:py-48">
        <div className="mx-auto max-w-[1180px]">
          <p className="label-tiny uppercase text-muted-foreground">An intentional boundary</p>
          <h2 className="mt-6 max-w-5xl font-display text-[clamp(2.7rem,7vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.05em]">
            <motion.span initial={{ opacity: 0.25 }} whileInView={{ opacity: 1 }} viewport={revealViewport} className="block">The internet was built for everyone.</motion.span>
            <motion.span initial={{ opacity: 0.25, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={revealViewport} transition={{ duration: 0.8 }} className="mt-5 block duo-text-gradient">DuoSpace wasn&apos;t.</motion.span>
          </h2>
          <p className="mt-10 max-w-md text-sm leading-7 text-muted-foreground">No followers. No public feed. No audience. Just two people sharing one private space.</p>
        </div>
      </section>

      <section className="relative px-5 py-28 md:py-44">
        <div className="mx-auto max-w-[1180px] text-center">
          <motion.p initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={revealViewport} className="font-display text-[clamp(3.5rem,12vw,11rem)] font-semibold leading-none tracking-[-0.06em]">No audience.</motion.p>
          <div className="mx-auto mt-14 flex max-w-3xl flex-wrap justify-center gap-x-7 gap-y-4">
            {REMOVED.map((item, index) => (
              <motion.span key={item} initial={{ opacity: 0.7 }} whileInView={{ opacity: 0.18, textDecorationLine: "line-through" }} viewport={revealViewport} transition={{ delay: index * 0.1, duration: 0.6 }} className="text-sm text-muted-foreground">{item}</motion.span>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={revealViewport} transition={{ delay: 0.7, duration: 0.7 }} className="mx-auto mt-14 inline-flex items-center gap-4 rounded-full border border-primary/30 bg-primary/10 px-7 py-4 font-mono text-xs uppercase text-foreground">
            <span>You</span><span className="h-1.5 w-1.5 rounded-full bg-primary" /><span>Them</span>
          </motion.div>
        </div>
      </section>
    </>
  );
}
