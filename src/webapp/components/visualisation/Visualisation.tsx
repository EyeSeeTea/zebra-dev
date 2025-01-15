import React from "react";
import styled from "styled-components";
import LoaderContainer from "../loader/LoaderContainer";

type VisualisationProps = {
    type: "map" | "chart";
    srcUrl: string;
};

type State = {
    type: "loading" | "loaded";
};

export const Visualisation: React.FC<VisualisationProps> = React.memo(props => {
    const { srcUrl, type } = props;

    const [state, setState] = React.useState<State>({ type: "loading" });

    const iframeRef: React.RefObject<HTMLIFrameElement> = React.createRef();

    React.useEffect(() => {
        console.debug(`Loading ${type} visualisation from ${srcUrl}`);
        const iframe = iframeRef.current;

        if (iframe !== null) {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            iframe.addEventListener("load", async () => {
                if (type === "map") {
                    await setMapStyling(iframe);
                    setState(prevState => ({ ...prevState, type: "loaded" }));
                } else {
                    await setChartStyling(iframe);
                    setState(prevState => ({ ...prevState, type: "loaded" }));
                }
            });
        }
    }, [iframeRef, srcUrl, type]);

    const isLoading = state.type === "loading";

    return (
        <React.Fragment>
            <LoaderContainer loading={isLoading}>
                <div style={isLoading ? styles.wrapperHidden : styles.wrapperVisible}>
                    <VisualisationIFrame
                        ref={iframeRef}
                        title="DHIS2 Maps App"
                        src={srcUrl}
                        width="100%"
                        height="100%"
                    />
                </div>
            </LoaderContainer>
        </React.Fragment>
    );
});

const VisualisationIFrame = styled.iframe``;

const styles: Record<string, React.CSSProperties> = {
    wrapperVisible: { width: "100%", height: "80vh" },
    wrapperHidden: { visibility: "hidden", width: "100%" },
};

function waitforDocumentToLoad(iframeDocument: Document, selector: string) {
    return new Promise(resolve => {
        const check = () => {
            if (iframeDocument.querySelector(selector)) {
                resolve(undefined);
            } else {
                setTimeout(check, 1000);
            }
        };
        check();
    });
}

function waitforElementToLoad(element: HTMLElement | Document, selector: string) {
    return new Promise(resolve => {
        const check = () => {
            if (element.querySelector(selector)) {
                resolve(undefined);
            } else {
                setTimeout(check, 1000);
            }
        };
        check();
    });
}

async function setMapStyling(iframe: HTMLIFrameElement) {
    if (!iframe.contentWindow) return;
    const iframeDocument = iframe.contentWindow.document;

    await waitforDocumentToLoad(iframeDocument, "#dhis2-app-root");
    await waitforElementToLoad(iframeDocument, "header");
    await waitforElementToLoad(iframeDocument, ".dhis2-map-container-wrapper");

    const iFrameRoot = iframeDocument.querySelector<HTMLElement>("#dhis2-app-root");

    iframeDocument.querySelectorAll("header").forEach(el => el.remove());
    iFrameRoot?.querySelectorAll("header").forEach(el => el.remove());

    iframeDocument.querySelectorAll(".app-menu-container").forEach(el => el.remove());
    iFrameRoot?.querySelectorAll(".app-menu-container").forEach(el => el.remove());

    iframeDocument.querySelectorAll(".layers-toggle-container").forEach(el => el.remove());
    iFrameRoot?.querySelectorAll(".layers-toggle-container").forEach(el => el.remove());

    iframeDocument.querySelectorAll(".layers-panel-drawer").forEach(el => el.remove());
    iFrameRoot?.querySelectorAll(".layers-panel-drawer").forEach(el => el.remove());

    const mapContainerWrapper = iframeDocument.querySelector<HTMLElement>(
        ".dhis2-map-container-wrapper"
    );
    if (mapContainerWrapper) mapContainerWrapper.style.inset = "0px";
}

async function setChartStyling(iframe: HTMLIFrameElement) {
    if (!iframe.contentWindow) return;
    const iframeDocument = iframe.contentWindow.document;

    await waitforDocumentToLoad(iframeDocument, "#dhis2-app-root");
    await waitforElementToLoad(iframeDocument, "header");
    await waitforElementToLoad(iframeDocument, ".data-visualizer-app");

    const iFrameRoot = iframeDocument.querySelector<HTMLElement>("#dhis2-app-root");

    iframeDocument.querySelectorAll("header").forEach(el => el.remove());
    iFrameRoot?.querySelectorAll("header").forEach(el => el.remove());

    iframeDocument.querySelectorAll(".main-left").forEach(el => el.remove());
    iFrameRoot?.querySelectorAll(".main-left").forEach(el => el.remove());

    iframeDocument.querySelectorAll(".section-toolbar").forEach(el => el.remove());
    iFrameRoot?.querySelectorAll(".section-toolbar").forEach(el => el.remove());

    iframeDocument.querySelectorAll(".main-center-layout").forEach(el => el.remove());
    iFrameRoot?.querySelectorAll(".main-center-layout").forEach(el => el.remove());

    iframeDocument.querySelectorAll(".main-center-titlebar").forEach(el => el.remove());
    iFrameRoot?.querySelectorAll(".main-center-titlebar").forEach(el => el.remove());

    iframeDocument
        .querySelectorAll('div[data-test="dhis2-analytics-toolbar"]')
        .forEach(el => el.remove());
    iFrameRoot
        ?.querySelectorAll('div[data-test="dhis2-analytics-toolbar"]')
        .forEach(el => el.remove());
}
