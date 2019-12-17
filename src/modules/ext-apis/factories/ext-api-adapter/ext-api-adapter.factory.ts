import { Injectable } from '@nestjs/common';
import { ExtApiNames } from '../../enums/ext-api-names/ext-api-names.enum';
import { ExtApiAdaptersUnion } from '../../types/ext-api-adapters-union/ext-api-adapters-union.type';
import { OmdbapiExtApiAdapter } from '../../adapters';

@Injectable()
export class ExtApiAdapterFactory {
  constructor(private readonly omdbapiExtApiAdapter: OmdbapiExtApiAdapter) {}

  chooseAdapter(extApiName: ExtApiNames): ExtApiAdaptersUnion {
    let adapter: ExtApiAdaptersUnion;

    switch (extApiName) {
      case ExtApiNames.Omdbapi:
        adapter = this.omdbapiExtApiAdapter;
        break;

      default:
        break;
    }

    return adapter;
  }
}
