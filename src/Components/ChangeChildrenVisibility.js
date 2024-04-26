export default function useChangeChildrenVisibility(element, visibility) {
  for (let index = 0; index < element.length; index++) {
    const Box = document.getElementById(element[index]);
    const childElements = Box?.children;
    for (let i = 0; i < childElements?.length; i++) {
      childElements[i].style.visibility = visibility;
      childElements[i].style.opacity = visibility === "hidden" ? "0" : "1";
    }
  }
}
