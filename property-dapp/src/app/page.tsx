// src/app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Aptos, Network, AptosConfig } from '@aptos-labs/ts-sdk';


// Initialize Aptos client
const config = new AptosConfig({ network: Network.DEVNET
});
const aptos = new Aptos(config);

interface Property {
  propertyId: string;
  owner: string;
  value: number;
  address: string;
}

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [newProperty, setNewProperty] = useState({
    propertyId: '',
    value: 0,
    address: ''
  });
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet is installed
  useEffect(() => {
    const checkWallet = async () => {
      try {
        // @ts-ignore
        const petra = window.petra;
        if (!petra) {
          setError('Petra wallet not installed. Please install Petra wallet extension.');
        }
      } catch (err) {
        console.error('Error checking wallet:', err);
        setError('Error checking wallet status');
      }
    };

    checkWallet();
  }, []);

  const connectWallet = async () => {
    try {
      setError(null);
      // @ts-ignore
      const petra = window.petra;
      if (!petra) {
        setError('Petra wallet not installed');
        return;
      }

      const response = await petra.connect();
      console.log('Wallet connected:', response);
      setWalletAddress(response.address);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet. Please try again.');
    }
  };

  const registerProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const petra = window.petra;
      if (!petra) {
        throw new Error('Petra wallet not found');
      }

      const moduleAddress = process.env.NEXT_PUBLIC_MODULE_ADDRESS;
      if (!moduleAddress) {
        throw new Error('Module address not configured');
      }

      // Convert to regular numbers
      const propertyId = Number(newProperty.propertyId);
      const propertyValue = Math.floor(newProperty.value * 100);

      // Corrected function path - removed PropertyToken:: since PropertyRegistry is the module name
      const transaction = {
        function: `${moduleAddress}::PropertyRegistry::register_property`,
        type_arguments: [],
        arguments: [propertyId, propertyValue]
      };

      console.log('Transaction payload:', transaction);

      const pendingTransaction = await petra.signAndSubmitTransaction(transaction);
      console.log('Transaction hash:', pendingTransaction.hash);

      await aptos.waitForTransaction({ transactionHash: pendingTransaction.hash });

      setProperties([...properties, {
        ...newProperty,
        owner: walletAddress
      }]);

      setNewProperty({ propertyId: '', value: 0, address: '' });
      alert('Property registered successfully!');
    } catch (err: any) {
      console.error('Detailed error:', err);
      setError(`Failed to register property: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
};

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {error && (
        <div className="mb-4 p-4 bg-red-500 text-white rounded-lg">
          {error}
        </div>
      )}

      <nav className="mb-8 flex justify-between items-center border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-blue-400">Property Registry DApp</h1>
        {!walletAddress ? (
          <button
            onClick={connectWallet}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="bg-gray-800 px-4 py-2 rounded-lg">
            <p className="text-gray-300">Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
          </div>
        )}
      </nav>

      {walletAddress && (
        <form onSubmit={registerProperty} className="mb-8 bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-blue-400">Register New Property</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Property ID</label>
              <input
                type="text"
                value={newProperty.propertyId}
                onChange={(e) => setNewProperty({ ...newProperty, propertyId: e.target.value })}
                className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Value (APT)</label>
              <input
                type="number"
                value={newProperty.value}
                onChange={(e) => setNewProperty({ ...newProperty, value: Number(e.target.value) })}
                className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Address</label>
              <input
                type="text"
                value={newProperty.address}
                onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white p-2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-2 rounded-lg text-white font-medium ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 transition-colors'
              }`}
            >
              {isLoading ? 'Registering...' : 'Register Property'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.propertyId} className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-semibold mb-2 text-blue-400">Property #{property.propertyId}</h3>
            <p className="text-gray-300">Address: {property.address}</p>
            <p className="text-gray-300">Value: {property.value} APT</p>
            <p className="text-gray-300">Owner: {property.owner.slice(0, 6)}...{property.owner.slice(-4)}</p>
          </div>
        ))}
      </div>

      {properties.length === 0 && walletAddress && (
        <div className="text-center text-gray-400 mt-8">
          No properties registered yet. Register your first property above!
        </div>
      )}
    </div>
  );
}