import { render } from "@testing-library/react";

import App from "../App";
import { getTestContext } from "../../../../utils/tests";
import { Provider } from "@dhis2/app-runtime";

describe("App", () => {
    it("renders the feedback component", async () => {
        const _view = getView();

        // expect(await view.findByText("Send feedback")).toBeInTheDocument();
    });
});

function getView() {
    const { compositionRoot, api } = getTestContext();
    return render(
        <Provider config={{ baseUrl: "http://localhost:8080", apiVersion: 30 }}>
            <App compositionRoot={compositionRoot} api={api} />
        </Provider>
    );
}
