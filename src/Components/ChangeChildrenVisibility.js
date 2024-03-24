export default function useChangeChildrenVisibility (element, visibility) {
    const childElements = element?.children;

    for (let i = 0; i < childElements?.length; i++) {
      childElements[i].style.visibility = visibility;
      
    }
}