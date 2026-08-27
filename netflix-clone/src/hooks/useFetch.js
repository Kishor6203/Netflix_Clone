import { useCallback, useEffect, useRef, useState } from "react";

const useFetch = (fetcher, options = {}) => {
  const {
    immediate = true,
    initialData = null,
    dependencies = [],
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const execute = useCallback(
    async (...args) => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const result = await fetcher(...args, {
          signal: controller.signal,
        });

        if (!mountedRef.current || controller.signal.aborted) return null;

        setData(result);
        return result;
      } catch (err) {
        if (
          controller.signal.aborted ||
          err?.name === "CanceledError" ||
          err?.name === "AbortError"
        ) {
          return null;
        }

        if (mountedRef.current) setError(err);
        throw err;
      } finally {
        if (mountedRef.current && !controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [fetcher]
  );

  useEffect(() => {
    if (!immediate) {
      setLoading(false);
      return;
    }

    execute().catch(() => {});
  }, [immediate, execute, ...dependencies]);

  const retry = useCallback(() => execute(), [execute]);

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  return {
    data,
    loading,
    error,
    execute,
    retry,
    reset,
    isIdle: !loading && !error && data === initialData,
    isSuccess: !loading && !error && data !== null,
    isError: Boolean(error) && !loading,
  };
};

export default useFetch;