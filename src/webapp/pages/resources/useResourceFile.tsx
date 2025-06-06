import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { ResourceFile } from "../../../domain/entities/resources/ResourceFile";
import { Maybe } from "../../../utils/ts-utils";
import { GlobalMessage } from "../form-page/useForm";
import { Id } from "../../../domain/entities/Ref";

type ResourceFileProps = {
    resourceFileId: Maybe<Id>;
    onDelete?: () => void;
};

type ResourceFileState = {
    globalMessage: Maybe<GlobalMessage>;
    resourceFile: Maybe<ResourceFile>;
    deleteResource: (id: Id, fileId: Id) => void;
};

export function useResourceFile(props: ResourceFileProps): ResourceFileState {
    const { resourceFileId, onDelete } = props;
    const { compositionRoot } = useAppContext();

    const [resourceFile, setResourceFile] = useState<Maybe<ResourceFile>>(undefined);
    const [globalMessage, setGlobalMessage] = useState<Maybe<GlobalMessage>>(undefined);

    useEffect(() => {
        if (resourceFileId) {
            compositionRoot.resources.downloadResourceFile.execute(resourceFileId).run(
                resourceFile => {
                    setResourceFile(resourceFile);
                },
                error => {
                    setGlobalMessage({
                        type: "error",
                        text: `Error downloading resource file: ${error}`,
                    });
                }
            );
        }
    }, [compositionRoot.resources.downloadResourceFile, resourceFileId]);

    const deleteResource = useCallback(
        (id: Id, fileId: Id) => {
            if (!onDelete) {
                return;
            }

            return compositionRoot.resources.delete.execute(id, fileId).run(
                () => {
                    setResourceFile(undefined);
                    onDelete();
                },
                error => {
                    setGlobalMessage({
                        type: "error",
                        text: `Error deleting resource file: ${error}`,
                    });
                }
            );
        },
        [compositionRoot.resources.delete, onDelete]
    );

    return {
        globalMessage: globalMessage,
        resourceFile: resourceFile,
        deleteResource: deleteResource,
    };
}
