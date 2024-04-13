module {
    public func contains<T>(a: [T], e: T, equals: (T,T) -> Bool): Bool{
        for (i in a.vals()){
            if (equals(i, e)){
                return true;
            };
        };
        false;
    }
}