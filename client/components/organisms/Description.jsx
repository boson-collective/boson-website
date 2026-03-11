import { useLayoutEffect, useRef } from "react";
import { SplitText, ScrollTrigger, gsap } from "../../lib/gsap";

function Description() {

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const dividerRef = useRef(null);
  const statsRef = useRef(null);

  const splitsRef = useRef([]);
  const ctxRef = useRef(null);

  useLayoutEffect(() => {

    if (
      !sectionRef.current ||
      !titleRef.current ||
      !bodyRef.current ||
      !dividerRef.current ||
      !statsRef.current
    ) return;

    ctxRef.current = gsap.context(() => {

      // TITLE

      const titleSplit = SplitText.create(titleRef.current,{
        type:"lines",
        linesClass:"line",
        mask:"lines"
      });

      splitsRef.current.push(titleSplit);

      const titleTween = gsap.fromTo(
        titleSplit.lines,
        {yPercent:35,opacity:0},
        {
          yPercent:0,
          opacity:1,
          duration:1.1,
          stagger:0.1,
          ease:"power2.out",
          paused:true
        }
      );

      ScrollTrigger.create({
        trigger:sectionRef.current,
        start:"top 75%",
        once:true,
        onEnter:(self)=>{
          titleTween.play();
          self.kill();
        }
      });

      // DIVIDER

      const dividerTween = gsap.fromTo(
        dividerRef.current,
        {scaleX:0,transformOrigin:"left center"},
        {
          scaleX:1,
          duration:0.9,
          ease:"power2.out",
          paused:true
        }
      );

      ScrollTrigger.create({
        trigger:dividerRef.current,
        start:"top 85%",
        once:true,
        onEnter:(self)=>{
          dividerTween.play();
          self.kill();
        }
      });

      // BODY

      bodyRef.current.querySelectorAll("[data-animate]").forEach((p)=>{

        const split = SplitText.create(p,{
          type:"lines",
          linesClass:"line",
          mask:"lines"
        });

        splitsRef.current.push(split);

        const tween = gsap.fromTo(
          split.lines,
          {yPercent:26,opacity:0},
          {
            yPercent:0,
            opacity:1,
            duration:1,
            stagger:0.05,
            ease:"power1.out",
            paused:true
          }
        );

        ScrollTrigger.create({
          trigger:p,
          start:"top 85%",
          once:true,
          onEnter:(self)=>{
            tween.play();
            self.kill();
          }
        });

      });

      // STATS

      const stats = statsRef.current.querySelectorAll("[data-stat]");

      const statsTween = gsap.fromTo(
        stats,
        {opacity:0,y:8},
        {
          opacity:1,
          y:0,
          duration:0.5,
          stagger:0.12,
          ease:"power2.out",
          paused:true
        }
      );

      ScrollTrigger.create({
        trigger:statsRef.current,
        start:"top 85%",
        once:true,
        onEnter:(self)=>{
          statsTween.play();
          self.kill();
        }
      });

    },sectionRef);

    return ()=>{
      splitsRef.current.forEach((s)=>s.revert());
      if(ctxRef.current) ctxRef.current.revert();
    };

  },[]);

  return (
    <section
      ref={sectionRef}
      data-theme="light"
      className="w-full bg-[#F3F4F5] text-neutral-900 py-12 lg:py-14 overflow-hidden"
    >
      <div className="max-w-screen mx-auto px-5 sm:px-6 lg:px-20">

        <div className="mb-10 lg:mb-14">

          <h1
            ref={titleRef}
            className="font-[Code_Pro] font-bold tracking-tight leading-[1.05]"
            style={{fontSize:"clamp(32px,4.9vw,134px)"}}
          >
            We're a digital agency that helps brands stay
            <span className="font-light"> consistent</span> online.
            We keep everything on track so you can stay
            <span className="font-light"> focused</span> on what matters
          </h1>

          <div
            ref={dividerRef}
            className="mt-8 lg:mt-10 h-[1.5px] w-full bg-neutral-300"
          />

        </div>

        <div className="flex flex-col lg:flex-row gap-y-14 lg:gap-x-20">

          <div ref={statsRef} className="w-full lg:flex-[0_0_42%] font-[Code_Pro]">

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-6 lg:gap-8 text-neutral-600">

              <div data-stat>
                <div className="text-[22px] font-medium text-neutral-900">100+</div>
                <div className="text-xs uppercase tracking-widest">
                  Projects delivered
                </div>
              </div>

              <div data-stat>
                <div className="text-[22px] font-medium text-neutral-900">3</div>
                <div className="text-xs uppercase tracking-widest">
                  Countries served
                </div>
              </div>

              <div data-stat>
                <div className="text-[22px] font-medium text-neutral-900">2.5m+</div>
                <div className="text-xs uppercase tracking-widest">
                  Total audience reach
                </div>
              </div>

            </div>

          </div>

          <div
            ref={bodyRef}
            className="w-full lg:flex-[0_0_28rem] lg:ml-auto text-neutral-800 text-[18px] lg:text-[17px] leading-[1.25]"
          >

            <p data-animate className="mb-8 lg:mb-10">
              Boson is an agency based in Bali, working with brands across
              Qatar, Malaysia, and beyond. We build digital experiences that stay
              sharp and consistent across every touchpoint — combining design,
              development, and brand operations into one cohesive system.
              This means fewer revisions, clearer decisions, and content that keeps
              working even as your brand scales.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Description;