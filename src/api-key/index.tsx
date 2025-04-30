import { KeyRound, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

import ApiCreationModal from 'api-key/components/createModal';
import CodeModal from './components/codeModal';
import { Button } from 'components/ui/button';
import useAPIkey from 'api-key/hooks/apikey';
import { quickstart_guide } from './utils';
import './index.scss';

const ApiKey = () => {
    const { apiKeys, getAPIkeys, deleteAPIkey } = useAPIkey();

    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    const [isApiModalOpen, setIsApiModalOpen] = useState(false);
    const [createdApiKey, setCreatedApiKey] = useState('');

    useEffect(() => {
        getAPIkeys();
    }, [])

    return (
        <div className="api-key-container">
            <h1 className='api-key-title'>API Keys</h1>
            <div className='quickstart-guide'>
                <h3>{quickstart_guide}</h3>
                <Button variant={'outline'} onClick={() => setIsCodeModalOpen(true)}>
                    How to use the API key?
                </Button>
            </div>
            <Button variant={'default'} className='api-creation-modal-btn' onClick={() => setIsApiModalOpen(true)}>
                <KeyRound />
                Create API key
            </Button>
            <CodeModal isOpen={isCodeModalOpen} onClose={() => setIsCodeModalOpen(false)} title='How to use the API key' content={quickstart_guide} />
            <ApiCreationModal isOpen={isApiModalOpen} onClose={() => setIsApiModalOpen(false)} createdApiKey={createdApiKey} setCreatedApiKey={setCreatedApiKey} />
            <div className="api-keys-list">
                <h2>Your API keys are listed below. You can also view and manage your API keys here.</h2>
                <div className="api-keys-table">
                    <table>
                        <thead>
                            <tr>
                                <th>API key name</th>
                                <th>API key</th>
                                <th>created</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {apiKeys?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className='no-apikeys'>No API keys generated yet.</td>
                                </tr>
                            ) : (
                                apiKeys?.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td
                                            className='api-key-text'
                                            onClick={() => { setIsApiModalOpen(true); setCreatedApiKey(item.apiKey); }}
                                        >{item.apiKey.substring(0, 5)}...
                                            {item.apiKey.substring(item.apiKey.length - 5)}
                                        </td>
                                        <td>{item.createdAt}</td>
                                        <td>
                                            <button onClick={() => deleteAPIkey(item.apiKey)}>
                                                <Trash size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

export default ApiKey;