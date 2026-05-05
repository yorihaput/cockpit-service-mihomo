import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle } from "@patternfly/react-core/dist/esm/components/Card/index.js";
import { EmptyState, EmptyStateBody, EmptyStateFooter } from "@patternfly/react-core/dist/esm/components/EmptyState/index.js";
import { EmptyStateHeader } from "@patternfly/react-core/dist/esm/components/EmptyState/EmptyStateHeader.js";
import { Title } from "@patternfly/react-core/dist/esm/components/Title/index.js";
import { ExclamationCircleIcon } from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon.js";
import { useConfig } from '../context/ConfigContext';
import cockpit from 'cockpit';

export const ConfigExplorer = () => {
    const { config, isLoading } = useConfig();
    const [hasFilesPlugin, setHasFilesPlugin] = useState<boolean | null>(null);

    useEffect(() => {
        // Pengecekan JavaScript untuk plugin cockpit-files sesuai permintaan
        const checkPlugin = async () => {
            try {
                // Gunakan cockpit.manifests jika tersedia
                // Atau fallback dengan membuat request fetch untuk memastikan ketersediaan UI file.
                if (cockpit && (cockpit as any).packages) {
                    const packages = await (cockpit as any).packages();
                    const hasFiles = packages.some((p: any) => p.name === 'files' || p.name === 'cockpit-files');
                    setHasFilesPlugin(hasFiles);
                } else if (cockpit && (cockpit as any).manifests) {
                    // Alternative
                    const manifests = await (cockpit as any).manifests;
                    setHasFilesPlugin(!!manifests['files'] || !!manifests['cockpit-files']);
                } else {
                    // Fallback pengecekan dengan fetch ke path plugin files
                    const res = await fetch('/cockpit/@localhost/files/manifest.json');
                    setHasFilesPlugin(res.ok);
                }
            } catch (e) {
                // Jika error (misal CORS atau auth error), kita anggap ada dan biar iframe yg error
                setHasFilesPlugin(false);
            }
        };

        checkPlugin();
    }, []);

    if (isLoading || hasFilesPlugin === null) {
        return (
            <Card>
                <CardBody>Loading...</CardBody>
            </Card>
        );
    }

    if (!hasFilesPlugin) {
        return (
            <Card>
                <CardBody>
                    <EmptyState>
                        <EmptyStateHeader 
                            titleText="Plugin 'cockpit-files' Diperlukan" 
                            icon={ExclamationCircleIcon} 
                            headingLevel="h4" 
                        />
                        <EmptyStateBody>
                            Untuk menggunakan Config Explorer, Anda perlu menginstal plugin <strong>cockpit-files</strong>. 
                            <br /><br />
                            Jalankan perintah ini di terminal Anda:
                            <br />
                            <code>sudo apt install cockpit-files</code> 
                            <br />
                            (atau gunakan package manager yang sesuai dengan OS Anda), kemudian refresh halaman ini.
                        </EmptyStateBody>
                    </EmptyState>
                </CardBody>
            </Card>
        );
    }

    const filesUrl = `/cockpit/@localhost/files/index.html#${config.mihomoPath}`;

    return (
        <Card style={{ height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}>
            <CardTitle>Config Explorer - {config.mihomoPath}</CardTitle>
            <CardBody style={{ padding: 0, flexGrow: 1, position: 'relative' }}>
                <iframe
                    src={filesUrl}
                    style={{ width: '100%', height: '100%', border: 'none', position: 'absolute', top: 0, left: 0 }}
                    title="Cockpit Files Plugin"
                />
            </CardBody>
        </Card>
    );
};
