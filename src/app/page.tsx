import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <div className="page items-center justify-center space-y-8 px-4 text-center md:space-y-6 md:px-8 md:!pt-40 lg:space-y-4 lg:!pt-32">
      <div>
        <h1 className={`text-center text-4xl text-[40px] md:text-5xl`}>
          Deploy L3 Rollups with
          <br />
          <span className="xs:text-6xl text-5xl font-bold text-destructive md:text-6xl">
            Privacy and Scalability
          </span>
        </h1>
      </div>
      <div className="lg:max-w-xl">
        <h3 className={`text-2xl sm:text-[2rem]`}>
          Get ready for L3 season using Arbitrum Orbits, Avail and RISC Zero
        </h3>
        <Button
          size="lg"
          className={`z-10 mt-4 !h-12 text-xl tracking-wide md:mt-8`}
        >
          Deploy my L3 Rollup
        </Button>
      </div>
    </div>
  );
}
