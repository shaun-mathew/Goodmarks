export async function getCurrentTab() {
  const [activeTab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
    status: "complete",
  });

  return activeTab;
}
export async function getPageMetadata() {
  const activeTab = await getCurrentTab();
  const activeTabId = activeTab?.id;

  if (activeTabId) {
    return {
      url: activeTab.url,
      title: activeTab.title,
      icon: activeTab.favIconUrl,
    };
  }
  console.log("Tab not loaded");
  return null;
}
export async function getHTML(): Promise<string> {
  const activeTab = await getCurrentTab();
  const activeTabId = activeTab?.id;

  if (activeTabId) {
    const res = await chrome.scripting.executeScript({
      target: { tabId: activeTabId },
      func: DOMtoString,
      args: ["html"],
    });

    return res[0].result;
  }
  console.log("Tab not loaded");
}

export function DOMtoString(selector: string) {
  let res = null;
  if (selector) {
    res = document.querySelector(selector);
    if (!selector) return "ERROR: querySelector failed to find node";
  } else {
    res = document.documentElement;
  }
  return res?.outerHTML;
}
