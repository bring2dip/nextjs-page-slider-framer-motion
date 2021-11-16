import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'

function handleExitComplete() {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0 })
  }
}

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [direction, setDirection] = useState(0);
  const [slideWidth, setSlideWidth] = useState(1000);

  const resizeHandler = () => {
    setSlideWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  const pageSlideVariants = useMemo(() => {
    return {
      enter: (direction) => {
        return {          
          x: direction > 0 ? slideWidth : -slideWidth,          
        };
      },
      center: {        
        x: 0,        
      },
      exit: (direction) => {
        return {          
          x: direction < 0 ? slideWidth : -slideWidth,          
        };
      },
    };
  }, [slideWidth]);


  const handleLeft = () => {
    setDirection(-1);
    if (router.route === '/world') return;
    if (router.route === '/services') return router.push('/');    
    router.push('/world');

  };

  const handleRight = () => {
    setDirection(1);
    if (router.route === '/services') return;
    if (router.route === '/world') return router.push('/');
    router.push('/services');
  }

  return (
    <div className="main">
      <button style={{left: 10}} onClick={handleLeft}>Left</button>
      <AnimatePresence initial={false} onExitComplete={handleExitComplete} custom={direction}>
        <motion.div           
          className="slideContainer"         
          key={router.route}
          custom={direction}
          variants={pageSlideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'tween', duration: 1.5 },            
          }}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
      <button style={{right: 10}} onClick={handleRight}>Right</button>
      <style>
        {`
        body {
          padding: 0;
          margin: 0;
          background: #f9fbf8;
        }

        * {
          box-sizing: border-box;
          font-family: Helvetica, sans-serif;
          font-weight: 900;
          color: #222;
        }
        .main {
          position: relative;
        }

        button {
          z-index: 1;
          position: absolute;
          top: 50%;
        }
        .slideContainer {
          display: flex;
          position: absolute;
          top: 0;          
        }       
      `}
      </style>
    </div>
  )
}

export default MyApp
