(function($, $R){
  // 名前空間を設定する
  var App = $R.Library;

  /**
    * TabbedPanel オブジェクト
    * 参考URL：http://www.switchonthecode.com/tutorials/javascript-and-css-tutorial-dynamic-tabbed-panels
   */
  var TabbedPanel = App.TabbedPanel = new $R.Class();
  TabbedPanel.fn.name;
  TabbedPanel.fn.tabContainer;
  TabbedPanel.fn.panelContainer;
  TabbedPanel.fn.tabNumber        = 0;
  TabbedPanel.fn.currentHighPanel = null;
  TabbedPanel.fn.currentHighTab   = null;
  TabbedPanel.fn.lowTabStyle      = "lowTab";
  TabbedPanel.fn.highTabStyle     = "highTab";
  TabbedPanel.include({
    setInitContainer: function(name, tabContainer, panelContainer) {
      this.name           = name;
      this.tabContainer   = tabContainer;
      this.panelContainer = panelContainer;
    }
   ,createTab: function(tabName) {
      var tabID = this.name + 'Tab' + this.tabNumber;
      var panelID = this.name + 'Panel' + this.tabNumber;
        
      var panel = document.createElement('div');
      panel.style.left = '0px';
      panel.style.top = '0px';
      panel.style.width = '100%';
      panel.style.height = '100%';
      panel.style.display = 'none';
      panel.tabNum = this.tabNumber;
      panel.id = panelID;

      if(this.panelContainer.insertAdjacentElement == null) {
        this.panelContainer.appendChild(panel);
      }
      else {
        this.panelContainer.insertAdjacentElement("beforeEnd",panel); //Internet Explorer
      }
      var cell = this.tabContainer.insertCell(this.tabContainer.cells.length - 1); //insert new tab before spacer cell
      cell.id = tabID;
      cell.className = this.lowTabStyle;
      cell.tabNum = this.tabNumber;
      cell.onclick = this.onTabClicked;
      cell.innerHTML = '&nbsp;' + tabName;
      cell.panelObj = this;
      this.tabClickEl(cell);
      this.tabNumber++;
      return panel;
    }
   ,onTabClicked: function(event) { 
      var el = (window.event == null) ? event.target : window.event.srcElement; // Other : Internet Explorer
      el.panelObj.tabClickEl(el);
    }
   ,tabClickEl: function (element) {
      if(this.currentHighTab == element) return;
      if(this.currentHighTab != null) this.currentHighTab.className = this.lowTabStyle;
      if(this.currentHighPanel != null) this.currentHighPanel.style.display = 'none';
      this.currentHighPanel = null;
      this.currentHighTab = null;
      if(element == null) return;

      this.currentHighTab = element;
      this.currentHighPanel = document.getElementById(this.name + 'Panel' + this.currentHighTab.tabNum);
      if(this.currentHighPanel == null) {
        this.currentHighTab = null
        return;
      }
      this.currentHighTab.className = this.highTabStyle;
      this.currentHighPanel.style.display = '';
    }
   ,tabCloseEl: function(element) {
      if(element == null) return;
      if(element == this.currentHighTab) {
        var i = -1;
        if(this.tabContainer.cells.length > 2) {
           i = element.cellIndex;
           if(i == this.tabContainer.cells.length-2) {
             i = this.tabContainer.cells.length-3;
           }
           else {
             i++;
           }
        }
        if(i >= 0) {
          this.tabClickEl(this.tabContainer.cells[i]);
        }
        else {
          this.tabClickEl(null);
        }
      }

      var panel = document.getElementById(this.name + 'Panel' + element.tabNum);
      if(panel != null) this.panelContainer.removeChild(panel);

      this.tabContainer.deleteCell(element.cellIndex);
    }
  });

  App.TabbedPanelMixin = {
    /**
     * TabPanelオブジェクトを作成する
     * name:タブオブジェクトに付ける名前, tabElement:タブタイトルid, panelElement:タブコンテンツid
     */
    createTabObject: function(name, tabElement, panelElement) {
      $R.log("View createTabObject : start");

      var tabbedPanel    = new $R.Library.TabbedPanel();
      var tabContainer   = document.getElementById(tabElement);
      var panelContainer = document.getElementById(panelElement);

      tabbedPanel.setInitContainer(name, tabContainer, panelContainer);

      $R.log("View createTabObject : end");
      return tabbedPanel;
    }
    /**
     * TabPanelを追加する
     * tabController:タブオブジェクト, tabTitle:タブタイトル名, tabContents:タブコンテンツデータ
     */
    ,addTabPanel: function(tabController, tabTitle, tabContents) {
       var tabPanel = tabController.createTab(tabTitle);
       tabPanel.innerHTML = tabContents;
     }
    /**
     * 選択中のTabPanelを削除する
     * tabController:タブオブジェクト
     */
    ,removeTabPanel: function(tabController) {
       tabController.tabCloseEl(tabController.currentHighTab);
     }
  };
}(jQuery, Rmenu));