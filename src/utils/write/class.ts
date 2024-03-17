import { resolve } from 'path';

import type { Client } from '../../client/interfaces/Client';
import type { Options } from '../../client/interfaces/Options';
import { writeFile } from '../fileSystem';
import { getHttpRequestName } from '../getHttpRequestName';
import type { Templates } from '../registerHandlebarTemplates';
import { sortModelsByName } from '../sortModelsByName';
import { sortServicesByName } from '../sortServicesByName';

/**
 * Generate the OpenAPI client index file using the Handlebar template and write it to disk.
 * The index file just contains all the exports you need to use the client as a standalone
 * library. But yuo can also import individual models and services directly.
 * @param client Client containing models, schemas, and services
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param options Options passed to the `generate()` function
 */
export const writeClientClass = async (
    client: Client,
    templates: Templates,
    outputPath: string,
    options: Pick<Required<Options>, 'clientName' | 'enums' | 'httpClient' | 'postfixServices'>
): Promise<void> => {
    const templateResult = templates.client({
        $config: options,
        httpRequest: getHttpRequestName(options.httpClient),
        models: sortModelsByName(client.models),
        server: client.server,
        services: sortServicesByName(client.services),
        version: client.version,
    });

    await writeFile(resolve(outputPath, `${options.clientName}.ts`), templateResult);
};
