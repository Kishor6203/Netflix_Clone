import { useCallback, useEffect, useState } from "react";
import { getMediaDetails } from "../services/tmdb";

const useMediaDetails = (
  id,
  mediaType = "movie"
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetails = useCallback(
    async (signal) => {
      if (!id) {
        setData(null);
        setLoading(false);
        setError("Media ID is missing.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getMediaDetails(
          id,
          mediaType,
          { signal }
        );

        if (signal.aborted) return;

        setData(result);
      } catch (err) {
        if (signal.aborted) return;

        console.error(
          "Failed to load media details:",
          err
        );

        setData(null);

        setError(
          err?.userMessage ||
            err?.response?.data?.status_message ||
            err?.message ||
            "Unable to load this title."
        );
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [id, mediaType]
  );

  useEffect(() => {
    const controller =
      new AbortController();

    fetchDetails(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchDetails]);

  const refetch = useCallback(() => {
    const controller =
      new AbortController();

    fetchDetails(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchDetails]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

export default useMediaDetails;