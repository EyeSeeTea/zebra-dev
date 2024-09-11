import React from "react";
import styled from "styled-components";
import { useAppContext } from "../../contexts/app-context";
import { FilteredMapConfig } from "../../pages/dashboard/map/useMap";
import LoaderContainer from "../loader/LoaderContainer";

type MapProps = {
    config: FilteredMapConfig;
};

function useDhis2Url(path: string) {
    const { api, isDev } = useAppContext();
    return (isDev ? "/dhis2" : api.baseUrl) + path;
}

type State = {
    type: "loading" | "loaded";
};

export const Map: React.FC<MapProps> = React.memo(props => {
    const { config } = props;

    const [state, setState] = React.useState<State>({ type: "loading" });

    const baseUrl = useDhis2Url(`/api/apps/zebra-custom-maps-app/index.html`);

    const params = {
        currentApp: config.currentApp,
        currentPage: config.currentPage,
        zebraNamespace: config.zebraNamespace,
        dashboardDatastoreKey: config.dashboardDatastoreKey,
        id: config.mapId,
        orgUnits: config.orgUnits.join(","),
        programIndicatorId: config.programIndicatorId,
        programIndicatorName: config.programIndicatorName,
        programId: config.programId,
        programName: config.programName,
        startDate: config.startDate,
        endDate: config.endDate,
        timeField: config.timeField,
    };

    const srcUrl =
        baseUrl + "?" + new URLSearchParams(removeUndefinedProperties(params)).toString();

    const iframeRef: React.RefObject<HTMLIFrameElement> = React.createRef();

    React.useEffect(() => {
        const iframe = iframeRef.current;

        if (iframe !== null) {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            iframe.addEventListener("load", async () => {
                await setMapStyling(iframe);
                setState(prevState => ({ ...prevState, type: "loaded" }));
            });
        }
    }, [iframeRef]);

    const isLoading = state.type === "loading";

    return (
        <React.Fragment>
            <LoaderContainer loading={isLoading}>
                <div style={isLoading ? styles.wrapperHidden : styles.wrapperVisible}>
                    <MapEditorIFrame
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

const MapEditorIFrame = styled.iframe``;

const styles: Record<string, React.CSSProperties> = {
    wrapperVisible: { width: "100%", height: "80vh" },
    wrapperHidden: { visibility: "hidden", width: "100%" },
};

function removeUndefinedProperties<T extends object>(obj: T): Partial<T> {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        return value === undefined ? acc : { ...acc, [key]: value };
    }, {} as Partial<T>);
}

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
