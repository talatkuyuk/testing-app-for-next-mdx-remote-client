import React, { type CSSProperties } from "react";
import { useRouter } from "next/router";
import BeatLoader from "react-spinners/BeatLoader";

const LOADER_THRESHOLD = 250;

export default function NavigationLoader() {
  const [isLoading, setLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    let timer: NodeJS.Timeout;

    const start = () =>
      (timer = setTimeout(() => {
        setLoading(true);
      }, LOADER_THRESHOLD));

    const end = () => {
      if (timer) {
        clearTimeout(timer);
      }
      setLoading(false);
    };

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);

    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);

      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [router.events]);

  const cssOverride: CSSProperties = {
    position: "fixed",
    top: "0.5rem",
    right: "1rem",
    borderColor: "red",
  };

  return (
    <BeatLoader
      loading={isLoading}
      color="#36d7b7"
      cssOverride={cssOverride}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
}
