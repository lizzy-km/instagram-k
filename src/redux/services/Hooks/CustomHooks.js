import { useRef } from "react";

function areDependenciesEqual(prevDeps, nextDeps) {
  if (prevDeps.length !== nextDeps.length) return false;
  for (let i = 0; i < prevDeps.length; i++) {
      if (prevDeps[i] !== nextDeps[i]) return false;
  }
  return true;
}

export function useMemoCus(factory, dependencies) {
  const lastValueRef = useRef();
  const lastDependenciesRef = useRef();

  if (!lastDependenciesRef.current || !areDependenciesEqual(lastDependenciesRef.current, dependencies)) {
      lastValueRef.current = factory(); // Recompute the value
      lastDependenciesRef.current = dependencies; // Update dependencies
  }

  console.log(lastValueRef.current)
  return lastValueRef.current;
}



export function useCallBackCus (callback, dependencies)   {
  const lastCallbackRef = useRef();
  const lastDependenciesRef = useRef();

  if (!lastDependenciesRef.current || !dependencies.every((dep, i) => dep === lastDependenciesRef.current[i])) {
      lastCallbackRef.current = callback;
      lastDependenciesRef.current = dependencies;
  }

  return lastCallbackRef.current;
};