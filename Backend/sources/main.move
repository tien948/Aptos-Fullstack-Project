module PropertyToken::PropertyRegistry {
    use std::signer;
    use std::vector;

    // Error codes
    const PROPERTY_ALREADY_REGISTERED: u64 = 0;
    const PROPERTY_NOT_FOUND: u64 = 1;
    const UNAUTHORIZED: u64 = 2;

    // Property struct to store property information
    struct Property has key, store {
        owner: address,
        property_id: u64,
        value: u64
    }

    // Registry to keep track of all properties
    struct PropertyList has key {
        properties: vector<u64>
    }

    // Initialize a new property list for an account
    public fun initialize(account: &signer) {
        let account_addr = signer::address_of(account);
        if (!exists<PropertyList>(account_addr)) {
            move_to(account, PropertyList {
                properties: vector::empty()
            });
        }
    }

    // Register a new property
    public entry fun register_property(
        account: &signer,
        property_id: u64,
        value: u64
    ) acquires PropertyList {
        let account_addr = signer::address_of(account);
        
        // Ensure property doesn't already exist
        assert!(!exists<Property>(account_addr), PROPERTY_ALREADY_REGISTERED);
        
        // Create new property
        let property = Property {
            owner: account_addr,
            property_id,
            value
        };

        // Initialize property list if it doesn't exist
        if (!exists<PropertyList>(account_addr)) {
            initialize(account);
        };

        // Add property to the list
        let property_list = borrow_global_mut<PropertyList>(account_addr);
        vector::push_back(&mut property_list.properties, property_id);

        // Store property
        move_to(account, property);
    }

    // Transfer property ownership
    public entry fun transfer_ownership(
        from_account: &signer,
        to_address: address,
        property_id: u64
    ) acquires Property {
        let from_addr = signer::address_of(from_account);
        
        // Verify property exists
        assert!(exists<Property>(from_addr), PROPERTY_NOT_FOUND);
        
        let property = borrow_global_mut<Property>(from_addr);
        
        // Verify ownership
        assert!(property.owner == from_addr, UNAUTHORIZED);
        assert!(property.property_id == property_id, PROPERTY_NOT_FOUND);
        
        // Transfer ownership
        property.owner = to_address;
    }

    // View function to check if a property exists
    public fun property_exists(addr: address): bool {
        exists<Property>(addr)
    }

    // View function to get the number of properties in a list
    public fun get_property_count(addr: address): u64 acquires PropertyList {
        if (!exists<PropertyList>(addr)) {
            return 0
        };
        let property_list = borrow_global<PropertyList>(addr);
        vector::length(&property_list.properties)
    }
}