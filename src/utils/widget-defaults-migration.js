/**
 * Widget Defaults Migration Script
 * 
 * This script can be used to migrate widget defaults from Phase 1 to Phase 3
 * Run this script to change the default showSubmitButton behavior
 */

import { WIDGET_DEFAULTS, MIGRATION_CONFIG } from '../config/widget-defaults.js';

/**
 * Migration Script for Widget Defaults
 * Handles the transition from embedded buttons to composable patterns
 */
export class WidgetDefaultsMigration {
  /**
   * Migrate to Phase 2: Enable warnings and deprecation notices
   */
  static migrateToPhase2() {
    console.log('🔄 Migrating to Phase 2: Enable warnings and deprecation notices');
    
    // Update migration configuration
    MIGRATION_CONFIG.currentPhase = 'phase2';
    MIGRATION_CONFIG.phases.phase2.enableWarnings = true;
    MIGRATION_CONFIG.phases.phase2.showDeprecationNotices = true;
    
    // Keep current defaults but enable warnings
    console.log('✅ Migration to Phase 2 complete');
    console.log('⚠️  Warnings are now enabled for deprecated patterns');
    console.log('📝 Developers will see warnings when using old patterns');
  }
  
  /**
   * Migrate to Phase 3: Change defaults to composable behavior
   */
  static migrateToPhase3() {
    console.log('🔄 Migrating to Phase 3: Change defaults to composable behavior');
    
    // Update migration configuration
    MIGRATION_CONFIG.currentPhase = 'phase3';
    MIGRATION_CONFIG.phases.phase3.enableWarnings = true;
    MIGRATION_CONFIG.phases.phase3.showDeprecationNotices = true;
    MIGRATION_CONFIG.phases.phase3.autoMigrate = true;
    
    // Change defaults for all input widgets
    const inputWidgetTypes = [
      'input', 'password', 'textarea', 'date', 'checkbox', 'radio',
      'file', 'color', 'slider', 'rating', 'tags', 'toggle'
    ];
    
    inputWidgetTypes.forEach(widgetType => {
      if (WIDGET_DEFAULTS[widgetType]) {
        WIDGET_DEFAULTS[widgetType].showSubmitButton = false;
        console.log(`✅ Updated ${widgetType} default: showSubmitButton = false`);
      }
    });
    
    // Update SelectWidget default
    if (WIDGET_DEFAULTS.select) {
      WIDGET_DEFAULTS.select.disableOnSelect = true;
      console.log('✅ Updated select default: disableOnSelect = true');
    }
    
    console.log('✅ Migration to Phase 3 complete');
    console.log('🎯 All widgets now default to composable behavior');
    console.log('⚠️  Existing implementations may need explicit showSubmitButton: true');
  }
  
  /**
   * Revert to Phase 1: Backward compatibility mode
   */
  static revertToPhase1() {
    console.log('🔄 Reverting to Phase 1: Backward compatibility mode');
    
    // Update migration configuration
    MIGRATION_CONFIG.currentPhase = 'phase1';
    MIGRATION_CONFIG.phases.phase1.enableWarnings = false;
    
    // Restore original defaults
    const inputWidgetTypes = [
      'input', 'password', 'textarea', 'date', 'checkbox', 'radio',
      'file', 'color', 'slider', 'rating', 'tags', 'toggle'
    ];
    
    inputWidgetTypes.forEach(widgetType => {
      if (WIDGET_DEFAULTS[widgetType]) {
        WIDGET_DEFAULTS[widgetType].showSubmitButton = true;
        console.log(`✅ Reverted ${widgetType} default: showSubmitButton = true`);
      }
    });
    
    // Revert SelectWidget default
    if (WIDGET_DEFAULTS.select) {
      WIDGET_DEFAULTS.select.disableOnSelect = false;
      console.log('✅ Reverted select default: disableOnSelect = false');
    }
    
    console.log('✅ Reversion to Phase 1 complete');
    console.log('🔄 Backward compatibility restored');
  }
  
  /**
   * Preview migration changes without applying them
   */
  static previewMigration(targetPhase = 'phase3') {
    console.log(`👀 Previewing migration to ${targetPhase}`);
    
    const phaseConfig = MIGRATION_CONFIG.phases[targetPhase];
    if (!phaseConfig) {
      console.error(`❌ Unknown phase: ${targetPhase}`);
      return;
    }
    
    console.log(`\n📊 Migration Preview for ${targetPhase}:`);
    console.log(`Default showSubmitButton: ${phaseConfig.defaultShowSubmitButton}`);
    console.log(`Enable warnings: ${phaseConfig.enableWarnings}`);
    console.log(`Show deprecation notices: ${phaseConfig.showDeprecationNotices}`);
    console.log(`Auto-migrate: ${phaseConfig.autoMigrate}`);
    
    console.log('\n🔄 Widget Changes:');
    const inputWidgetTypes = [
      'input', 'password', 'textarea', 'date', 'checkbox', 'radio',
      'file', 'color', 'slider', 'rating', 'tags', 'toggle'
    ];
    
    inputWidgetTypes.forEach(widgetType => {
      const current = WIDGET_DEFAULTS[widgetType]?.showSubmitButton;
      const future = phaseConfig.defaultShowSubmitButton;
      if (current !== future) {
        console.log(`  ${widgetType}: ${current} → ${future}`);
      }
    });
    
    if (WIDGET_DEFAULTS.select) {
      const current = WIDGET_DEFAULTS.select.disableOnSelect;
      const future = targetPhase === 'phase3' ? true : false;
      if (current !== future) {
        console.log(`  select: ${current} → ${future}`);
      }
    }
  }
  
  /**
   * Check current migration status
   */
  static getStatus() {
    console.log('📊 Current Migration Status:');
    console.log(`Current Phase: ${MIGRATION_CONFIG.currentPhase}`);
    console.log(`Default showSubmitButton: ${MIGRATION_CONFIG.phases[MIGRATION_CONFIG.currentPhase].defaultShowSubmitButton}`);
    console.log(`Warnings Enabled: ${MIGRATION_CONFIG.phases[MIGRATION_CONFIG.currentPhase].enableWarnings}`);
    
    console.log('\n📋 Current Widget Defaults:');
    Object.entries(WIDGET_DEFAULTS).forEach(([type, defaults]) => {
      console.log(`  ${type}:`, defaults);
    });
  }
  
  /**
   * Validate migration configuration
   */
  static validateConfiguration() {
    console.log('🔍 Validating migration configuration...');
    
    const issues = [];
    
    // Check if all input widgets have showSubmitButton defined
    const inputWidgetTypes = [
      'input', 'password', 'textarea', 'date', 'checkbox', 'radio',
      'file', 'color', 'slider', 'rating', 'tags', 'toggle'
    ];
    
    inputWidgetTypes.forEach(widgetType => {
      if (!WIDGET_DEFAULTS[widgetType]) {
        issues.push(`Missing defaults for ${widgetType}`);
      } else if (WIDGET_DEFAULTS[widgetType].showSubmitButton === undefined) {
        issues.push(`Missing showSubmitButton default for ${widgetType}`);
      }
    });
    
    // Check SelectWidget
    if (!WIDGET_DEFAULTS.select) {
      issues.push('Missing defaults for select');
    } else if (WIDGET_DEFAULTS.select.disableOnSelect === undefined) {
      issues.push('Missing disableOnSelect default for select');
    }
    
    // Check migration phases
    ['phase1', 'phase2', 'phase3'].forEach(phase => {
      if (!MIGRATION_CONFIG.phases[phase]) {
        issues.push(`Missing configuration for ${phase}`);
      }
    });
    
    if (issues.length === 0) {
      console.log('✅ Configuration is valid');
    } else {
      console.log('❌ Configuration issues found:');
      issues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    return issues.length === 0;
  }
  
  /**
   * Generate migration report
   */
  static generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      currentPhase: MIGRATION_CONFIG.currentPhase,
      widgetDefaults: { ...WIDGET_DEFAULTS },
      migrationConfig: { ...MIGRATION_CONFIG },
      recommendations: []
    };
    
    // Add recommendations based on current state
    if (MIGRATION_CONFIG.currentPhase === 'phase1') {
      report.recommendations.push('Consider migrating to Phase 2 to enable warnings');
      report.recommendations.push('Plan for Phase 3 migration to composable defaults');
    } else if (MIGRATION_CONFIG.currentPhase === 'phase2') {
      report.recommendations.push('Monitor for deprecated pattern warnings');
      report.recommendations.push('Prepare for Phase 3 migration');
    } else if (MIGRATION_CONFIG.currentPhase === 'phase3') {
      report.recommendations.push('Ensure all forms use composable patterns');
      report.recommendations.push('Update documentation for new defaults');
    }
    
    return report;
  }
}

// Export convenience functions for direct usage
export const migrateToPhase2 = () => WidgetDefaultsMigration.migrateToPhase2();
export const migrateToPhase3 = () => WidgetDefaultsMigration.migrateToPhase3();
export const revertToPhase1 = () => WidgetDefaultsMigration.revertToPhase1();
export const previewMigration = (phase) => WidgetDefaultsMigration.previewMigration(phase);
export const getMigrationStatus = () => WidgetDefaultsMigration.getStatus();
export const validateConfiguration = () => WidgetDefaultsMigration.validateConfiguration();
export const generateMigrationReport = () => WidgetDefaultsMigration.generateReport();
