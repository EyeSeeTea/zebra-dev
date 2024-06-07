import { render } from "@testing-library/react";

import App from "../App";
import { getTestContext } from "../../../../utils/tests";
import { Provider } from "@dhis2/app-runtime";

// TODO: fix
describe("App", () => {
    it.skip("renders the feedback component", async () => {
        const view = getView();

        expect(await view.findByText("Send feedback")).toBeInTheDocument();
    });
});

function getView() {
    const { compositionRoot } = getTestContext();
    return render(
        <Provider config={{ baseUrl: "http://localhost:8080", apiVersion: 30 }}>
            <App compositionRoot={compositionRoot} />
        </Provider>
    );
}
