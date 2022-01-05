import { useGlobalState, useToggle } from "@har/use";

const useCollapseAnchor = useGlobalState(() => useToggle(true));
export default useCollapseAnchor;
