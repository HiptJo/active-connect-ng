export class LoadingStatus {
  static loading: Map<string, boolean>;
  isLoading(entry?: string): boolean {
    if (entry) {
      // return specific loading
      return LoadingStatus.loading.has(entry);
    } else {
      // return general loading
      return LoadingStatus.loading.size > 0;
    }
  }

  getCurrent(): number {
    let count = 0;
    LoadingStatus.loading.forEach((e) => {
      if (e) count++;
    });
    if (count == 0) {
      LoadingStatus.loading.clear();
    }
    return count;
  }
  getTotal(): number {
    return LoadingStatus.loading.size;
  }
}
