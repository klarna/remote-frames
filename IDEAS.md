// KP Main Iframe
<UnicornDialogs>
  <Identification
    name={...}
    onComplete={}
  />
</UnicornDialogs>

// Identification
<View ..>
  <IdModule

  />
</View>

// IdModule
{state.showPrivacySettings &&
  <UnicornDialogs>
    <PrivacySettings />
  </UnicornDialogs>
}

// FSO KP
<UnicornDialogs>
  <Renderer /> // <- owned by KP
</UnicornDialogs>

// KCO Main iframe
<UnicornDialogsProvider
  onAddStackElement={() => dispatch(openFSO())}
  onEmptyStack={() => dispatch(closeFSO())}
  adapter={adapter}>
  <IdModule />
</UnicornDialogsProvider>

// KCO FSO
<UnicornDialogsProvider
  adapter={adapter}>
  <UnicornDialogs>
    <Renderer /> // <- owned by KP
  </UnicornDialogs>
</UnicornDialogsProvider>
